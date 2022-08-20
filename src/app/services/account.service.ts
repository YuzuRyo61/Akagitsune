import { Injectable } from '@angular/core';
import { Account } from '../lib/account';
import { v4 as uuidV4 } from 'uuid';
import { AccountType } from '../lib/account-type';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Instance } from '../lib/instance';
import { MisskeyMeta } from '../lib/misskey/meta';
import { MastodonInstance } from '../lib/mastodon/instance';
import packageJson from '../../../package.json';
import { AppToken } from '../lib/app-token';
import { MastodonApp } from '../lib/mastodon/app';
import { AppAuthorize } from '../lib/app-authorize';
import { MisskeyMiAuthResponse } from '../lib/misskey/miauth';
import { IssueToken } from '../lib/issue-token';
import { MastodonAuthResponse } from '../lib/mastodon/auth';
import { AccountProfile } from '../lib/account-profile';
import { MisskeyUser } from '../lib/misskey/user';
import { MastodonUser } from '../lib/mastodon/user';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private hc: HttpClient,
  ) {
  }
  private _account: Map<string, Account> = new Map<string, Account>();
  private _accountProfile: Map<string, AccountProfile> = new Map<string, AccountProfile>();
  private _appToken: Map<string, AppToken> = new Map<string, AppToken>();

  get account(): Map<string, Account> {
    return this._account;
  }

  get accountProfile(): Map<string, AccountProfile> {
    return this._accountProfile;
  }

  get appToken(): Map<string, AppToken> {
    return this._appToken;
  }

  loadAccounts(): void {
    const storage = localStorage.getItem('accounts');
    if (storage === null) return;

    this._account = new Map<string, Account>(Object.entries(JSON.parse(storage)));

    this._account.forEach((value, key) => {
      this.fetchProfile(
        value.address,
        value.type,
        value.token,
      ).subscribe({
        next: profile => {
          this._accountProfile.set(key, profile);
        },
        error: err => {
          console.error(err);
        },
      });
    });
  }

  private saveAccount() {
    localStorage.setItem('accounts', JSON.stringify(Object.fromEntries(this._account)));
  }

  addAccount(
    address: string,
    type: AccountType,
    token: string,
  ): void {
    const id = uuidV4();
    const newAccount: Account = {
      address,
      type,
      token,
    };

    this._account.set(id, newAccount);
    this.saveAccount();

    this.fetchProfile(
      address,
      type,
      token,
    ).subscribe({
      next: value => {
        this._accountProfile.set(id, value);
      },
      error: err => {
        console.error(err);
      },
    });
  }

  removeAccount(
    id: string,
  ): void {
    this._account.delete(id);
    this.saveAccount();
  }

  loadAppToken(): void {
    const storage = localStorage.getItem('appToken');
    if (storage === null) return;

    this._appToken = new Map<string, AppToken>(Object.entries(JSON.parse(storage)));
  }

  private saveAppToken() {
    localStorage.setItem('appToken', JSON.stringify(Object.fromEntries(this._appToken)));
  }

  private addAppToken(
    address: string,
    clientId: string,
    clientSecret: string,
  ): void {
    this._appToken = this._appToken.set(address, {
      client_id: clientId,
      client_secret: clientSecret,
    });

    this.saveAppToken();
  }

  removeAppToken(
    address: string,
  ): void {
    this._appToken.delete(address);

    this.saveAppToken();
  }

  checkInstance(
    address: string,
    type: AccountType,
  ): Observable<Instance> {
    return new Observable((observer) => {
      switch (type) {
        case 'misskey':
          this.hc.post<MisskeyMeta>(`https://${ address }/api/meta`, {}, {
            responseType: 'json',
          }).subscribe({
            next: value => {
              observer.next({
                name: value.name,
                version: value.version,
                banner: value.bannerUrl,
              });
              observer.complete();
            },
            error: err => {
              observer.error(err);
            },
          });
          break;
        case 'mastodon':
          this.hc.get<MastodonInstance>(`https://${ address }/api/v1/instance`, {
            responseType: 'json',
          }).subscribe({
            next: value => {
              observer.next({
                name: value.title,
                version: value.version,
                banner: value.thumbnail,
              });
              observer.complete();
            },
            error: err => {
              observer.error(err);
            },
          });
          break;
      }
    });
  }

  issueAuthorizeURL(
    address: string,
    type: AccountType,
  ): Observable<AppAuthorize> {
    return new Observable<AppAuthorize>((observer) => {
      switch (type) {
        case 'misskey':
          const sessionId = uuidV4();
          observer.next({
            url: encodeURI(
              `https://${ address }/miauth/${ sessionId }?name=Akagitsune&permission=read:account,write:account,read:drive,write:drive,write:notes,write:notifications,write:following`,
            ),
            sessionId,
          });
          observer.complete();
          break;
        case 'mastodon':
          const redirectUri = `urn:ietf:wg:oauth:2.0:oob`;
          const scopes = 'read write follow push';
          if (this._appToken.has(address)) {
            // Using exists oauth token
            const token = this._appToken.get(address);
            if (token === undefined) {
              observer.error('[Internal error] token is undefined');
              return;
            }
            observer.next({
              url: encodeURI(
                `https://${ address }/oauth/authorize?response_type=code&client_id=${ token.client_id }&redirect_uri=${ redirectUri }&scope=${ scopes }`,
              ),
            });
            observer.complete();
          } else {
            // Issue oauth token
            this.hc.post<MastodonApp>(`https://${ address }/api/v1/apps`, {
              'client_name': 'Akagitsune',
              'redirect_uris': redirectUri,
              'scopes': scopes,
              'website': packageJson.homepage,
            }).subscribe({
              next: value => {
                this.addAppToken(address, value.client_id, value.client_secret);
                observer.next({
                  url: encodeURI(
                    `https://${ address }/oauth/authorize?response_type=code&client_id=${ value.client_id }&redirect_uri=${ redirectUri }&scope=${ scopes }`,
                  ),
                });
                observer.complete();
              },
              error: err => {
                observer.error(err);
              },
            });
          }
          break;
      }
    });
  }

  issueToken(
    address: string,
    type: AccountType,
    data: IssueToken,
  ): Observable<string> {
    return new Observable<string>((observer) => {
      switch (type) {
        case 'misskey':
          this.hc.post<MisskeyMiAuthResponse>(`https://${ address }/api/miauth/${ data.code }/check`, {}).subscribe({
            next: value => {
              if (!value.ok) {
                observer.error('MiAuth "ok" was response false');
                return;
              }
              if (value.token === undefined) {
                observer.error('WHERE\'S MiAuth token!?');
                return;
              }

              observer.next(value.token);
              observer.complete();
            },
            error: err => {
              observer.error(err);
            }
          });
          break;
        case 'mastodon':
          if (!this._appToken.has(address)) {
            observer.error('[Internal error] app token not found');
            return;
          }
          const appTokenData = this._appToken.get(address);
          if (appTokenData === undefined) {
            observer.error('[Internal error] app token not found');
            return;
          }

          this.hc.post<MastodonAuthResponse>(`https://${ address }/oauth/token`, {
            'grant_type': 'authorization_code',
            'client_id': appTokenData.client_id,
            'client_secret': appTokenData.client_secret,
            'redirect_uri': 'urn:ietf:wg:oauth:2.0:oob',
            'scope': 'read write follow push',
            'code': data.code,
          }).subscribe({
            next: value => {
              observer.next(value.access_token);
              observer.complete();
            },
            error: err => {
              observer.error(err);
            },
          });
          break;
      }
    });
  }

  private fetchProfile(
    address: string,
    type: AccountType,
    token: string,
  ): Observable<AccountProfile> {
    return new Observable<AccountProfile>((observer) => {
      switch (type) {
        case 'misskey':
          this.hc.post<MisskeyUser>(`https://${address}/api/i`, {
            'i': token,
          }).subscribe({
            next: value => {
              observer.next({
                username: value.username,
                avatar_url: value.avatarUrl,
                banner_url: value.bannerUrl,
                is_bot: value.isBot,
                display_name: value.name,
              });
              observer.complete();
            },
            error: err => {
              observer.error(err);
            }
          });
          break;
        case 'mastodon':
          this.hc.get<MastodonUser>(`https://${address}/api/v1/accounts/verify_credentials`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }).subscribe({
            next: value => {
              observer.next({
                username: value.username,
                is_bot: value.bot,
                display_name: value.display_name,
                banner_url: value.header,
                avatar_url: value.avatar,
              });
              observer.complete();
            },
            error: err => {
              observer.error(err);
            }
          });
          break;
      }
    });
  }
}

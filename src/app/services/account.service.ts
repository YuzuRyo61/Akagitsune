import { Injectable } from '@angular/core';
import { Account } from '../lib/account';
import { v4 as uuidV4 } from 'uuid';
import { AccountType } from '../lib/account-type';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Instance } from '../lib/instance';
import { MisskeyMeta } from '../lib/misskey/meta';
import { MastodonInstance } from '../lib/mastodon/instance';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private hc: HttpClient,
  ) { }

  fetchAccounts(): Account[] {
    const storage = localStorage.getItem('accounts');
    if (storage === null) return [];

    return JSON.parse(storage) as Account[];
  }

  private saveAccount(data: Account[]) {
    localStorage.setItem('accounts', JSON.stringify(data));
  }

  addAccount(
    address: string,
    username: string,
    type: AccountType,
    token: string,
  ): Account[] {
    const newAccount: Account = {
      id: uuidV4(),
      address,
      username,
      type,
      token,
    };

    const currentData = this.fetchAccounts();
    currentData.push(newAccount);
    this.saveAccount(currentData);

    return currentData;
  }

  removeAccount(
    id: string,
  ): Account[] {
    let currentData = this.fetchAccounts();
    currentData = currentData.filter(item => item.id !== id);
    this.saveAccount(currentData);

    return currentData;
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
            }
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
            }
          });
          break;
      }
    });
  }
}

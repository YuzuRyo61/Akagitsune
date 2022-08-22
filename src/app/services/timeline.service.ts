import { Injectable } from '@angular/core';
import { Account } from '../lib/account';
import { webSocket } from 'rxjs/webSocket';
import { MastodonStreamEvent } from '../lib/mastodon/stream';
import { Observable, Subscriber } from 'rxjs';
import { Statuses } from '../lib/statuses';
import { MastodonStatus } from '../lib/mastodon/status';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MisskeyNote } from '../lib/misskey/note';
import { v4 as uuidV4 } from 'uuid';
import { MisskeyStreamEvent } from '../lib/misskey/stream';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TimelineService {

  constructor(
    private hc: HttpClient,
  ) {
  }

  // Misskey parser

  private parseMisskeyNote(sub: Subscriber<Statuses[]>, value: MisskeyNote[]) {
    let data: Statuses[] = [];
    value.forEach((val, _) => {
      data.push({
        id: val.id,
        cw: val.cw,
        body: val.text,
        created_at: val.createdAt,
        user: {
          id: val.user.id,
          acct: (val.user.host ? `${ val.user.username }@${ val.user.host }` : val.user.username),
          avatar_url: val.user.avatarUrl,
          display_name: val.user.name,
        },
      });
    });
    sub.next(data);
  }

  private parseMisskeyNoteStream(sub: Subscriber<Statuses>, value: MisskeyStreamEvent) {
    sub.next({
      id: value.body.body.id,
      cw: value.body.body.cw,
      body: value.body.body.text,
      created_at: value.body.body.createdAt,
      user: {
        id: value.body.body.user.id,
        acct: (value.body.body.user.host ? `${ value.body.body.user.username }@${ value.body.body.user.host }` : value.body.body.user.username),
        display_name: value.body.body.user.name,
        avatar_url: value.body.body.user.avatarUrl,
      },
    });
  }

  private misskeyNoteTimelineSubscribe(sub: Subscriber<Statuses[]>, observer: Observable<MisskeyNote[]>) {
    observer.subscribe({
      next: value => {
        this.parseMisskeyNote(sub, value);
      },
      error: err => {
        sub.error(err);
      },
      complete: () => {
        sub.complete();
      }
    });
  }

  private misskeyNoteStreamSubscribe(sub: Subscriber<Statuses>, observer: Observable<MisskeyStreamEvent>) {
    observer.subscribe({
      next: value => {
        this.parseMisskeyNoteStream(sub, value);
      },
      error: err => {
        sub.error(err);
      },
      complete: () => {
        sub.complete();
      },
    });
  }

  // Mastodon parser

  private parseMastodonStatus(sub: Subscriber<Statuses[]>, value: MastodonStatus[]) {
    let data: Statuses[] = [];
    value.forEach((val, _) => {
      data.push({
        id: val.id,
        body: val.content,
        user: {
          id: val.account.id,
          acct: val.account.acct,
          display_name: val.account.display_name,
          avatar_url: val.account.avatar,
        },
        cw: val.spoiler_text,
        created_at: val.created_at,
      });
    });
    sub.next(data);
  }

  private parseMastodonStatusStream(sub: Subscriber<Statuses>, value: MastodonStatus) {
    sub.next({
      id: value.id,
      body: value.content,
      cw: value.spoiler_text,
      user: {
        id: value.account.id,
        acct: value.account.acct,
        display_name: value.account.display_name,
        avatar_url: value.account.avatar,
      },
      created_at: value.created_at,
    });
  }

  private mastodonStatusTimelineSubscribe(sub: Subscriber<Statuses[]>, observer: Observable<MastodonStatus[]>) {
    observer.subscribe({
      next: value => {
        this.parseMastodonStatus(sub, value);
      },
      error: err => {
        sub.error(err);
      },
      complete: () => {
        sub.complete();
      },
    });
  }

  private mastodonStatusStreamSubscribe(sub: Subscriber<Statuses>, observer: Observable<MastodonStreamEvent>) {
    observer.subscribe({
      next: value => {
        switch (value.event) {
          case 'update':
            if (value.payload === undefined) return;
            const status = JSON.parse(value.payload) as MastodonStatus;
            this.parseMastodonStatusStream(sub, status);
        }
      },
      error: err => {
        sub.error(err);
      },
      complete: () => {
        sub.complete();
      },
    });
  }

  // timeline methods

  homeTimeline(account: Account, option?: { untilId?: string }): Observable<Statuses[]> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses[]>(sub => {
          this.misskeyNoteTimelineSubscribe(sub, this.hc.post<MisskeyNote[]>(
            `${ environment.httpProtocol }://${ account.address }/api/notes/timeline`, {
            'i': account.token,
            'limit': 20,
            'untilId': option?.untilId,
          }));
        });
      case 'mastodon':
        return new Observable<Statuses[]>(sub => {
          let params = new HttpParams();
          if (option !== undefined && option.untilId !== undefined) params = params.set('max_id', option.untilId);

          this.mastodonStatusTimelineSubscribe(sub, this.hc.get<MastodonStatus[]>(
            `${ environment.httpProtocol }://${ account.address }/api/v1/timelines/home`, {
            headers: {
              'Authorization': `Bearer ${ account.token }`,
            },
            params,
          }));
        });
    }
  }

  localTimeline(account: Account, option?: { untilId?: string }): Observable<Statuses[]> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses[]>(sub => {
          this.misskeyNoteTimelineSubscribe(sub, this.hc.post<MisskeyNote[]>(
            `${ environment.httpProtocol }://${ account.address }/api/notes/local-timeline`, {
            'i': account.token,
            'limit': 20,
            'untilId': option?.untilId,
          }));
        });
      case 'mastodon':
        return new Observable<Statuses[]>(sub => {
          let params = new HttpParams().set('local', true);
          if (option !== undefined && option.untilId !== undefined) params = params.set('max_id', option.untilId);

          this.mastodonStatusTimelineSubscribe(sub, this.hc.get<MastodonStatus[]>(
            `${ environment.httpProtocol }://${ account.address }/api/v1/timelines/public`, {
            headers: {
              'Authorization': `Bearer ${ account.token }`,
            },
            params,
          }));
        });
    }
  }

  socialTimeline(account: Account, option?: { untilId?: string }): Observable<Statuses[]> | undefined {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses[]>(sub => {
          this.misskeyNoteTimelineSubscribe(sub, this.hc.post<MisskeyNote[]>(
            `${ environment.httpProtocol }://${ account.address }/api/notes/hybrid-timeline`, {
              'i': account.token,
              'limit': 20,
              'untilId': option?.untilId,
            }));
        });
      default:
        // Social stream is only available Misskey.
        return;
    }
  }

  globalTimeline(account: Account, option?: { untilId?: string }): Observable<Statuses[]> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses[]>(sub => {
          this.misskeyNoteTimelineSubscribe(sub, this.hc.post<MisskeyNote[]>(
            `${ environment.httpProtocol }://${ account.address }/api/notes/global-timeline`, {
              'i': account.token,
              'limit': 20,
              'untilId': option?.untilId,
            }));
        });
      case 'mastodon':
        return new Observable<Statuses[]>(sub => {
          let params = new HttpParams();
          if (option !== undefined && option.untilId !== undefined) params = params.set('max_id', option.untilId);

          this.mastodonStatusTimelineSubscribe(sub, this.hc.get<MastodonStatus[]>(
            `${ environment.httpProtocol }://${ account.address }/api/v1/timelines/public`, {
              headers: {
                'Authorization': `Bearer ${ account.token }`,
              },
              params,
            }));
        });
    }
  }

  // stream method

  homeStream(account: Account): Observable<Statuses> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses>(sub => {
          const misskeyStream = webSocket({
            url: `${ environment.websocketProtocol }://${ account.address }/streaming?i=${ account.token }`,
          });
          misskeyStream.next({
            type: 'connect',
            body: {
              channel: 'homeTimeline',
              id: uuidV4(),
            },
          });
          const misskeyStreamCast = misskeyStream.asObservable() as Observable<MisskeyStreamEvent>;
          this.misskeyNoteStreamSubscribe(sub, misskeyStreamCast);
        });
      case 'mastodon':
        return new Observable<Statuses>(sub => {
          const mastodonStream = webSocket<MastodonStreamEvent>({
            url: `${ environment.websocketProtocol }://${ account.address }/api/v1/streaming?access_token=${ account.token }&stream=user`,
          }).asObservable();
          this.mastodonStatusStreamSubscribe(sub, mastodonStream);
        });
    }
  }

  localStream(account: Account): Observable<Statuses> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses>(sub => {
          const misskeyStream = webSocket({
            url: `${ environment.websocketProtocol }://${ account.address }/streaming?i=${ account.token }`,
          });
          misskeyStream.next({
            type: 'connect',
            body: {
              channel: 'localTimeline',
              id: uuidV4(),
            },
          });
          const misskeyStreamCast = misskeyStream.asObservable() as Observable<MisskeyStreamEvent>;
          this.misskeyNoteStreamSubscribe(sub, misskeyStreamCast);
        });
      case 'mastodon':
        return new Observable<Statuses>(sub => {
          const mastodonStream = webSocket<MastodonStreamEvent>({
            url: `${ environment.websocketProtocol }://${ account.address }/api/v1/streaming?access_token=${ account.token }&stream=public:local`,
          }).asObservable();
          this.mastodonStatusStreamSubscribe(sub, mastodonStream);
        });
    }
  }

  socialStream(account: Account): Observable<Statuses> | undefined {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses>(sub => {
          const misskeyStream = webSocket({
            url: `${ environment.websocketProtocol }://${ account.address }/streaming?i=${ account.token }`,
          });
          misskeyStream.next({
            type: 'connect',
            body: {
              channel: 'hybridTimeline',
              id: uuidV4(),
            },
          });
          const misskeyStreamCast = misskeyStream.asObservable() as Observable<MisskeyStreamEvent>;
          this.misskeyNoteStreamSubscribe(sub, misskeyStreamCast);
        });
      default:
        // Social stream is only available Misskey.
        return;
    }
  }

  globalStream(account: Account): Observable<Statuses> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses>(sub => {
          const misskeyStream = webSocket({
            url: `${ environment.websocketProtocol }://${ account.address }/streaming?i=${ account.token }`,
          });
          misskeyStream.next({
            type: 'connect',
            body: {
              channel: 'globalTimeline',
              id: uuidV4(),
            },
          });
          const misskeyStreamCast = misskeyStream.asObservable() as Observable<MisskeyStreamEvent>;
          this.misskeyNoteStreamSubscribe(sub, misskeyStreamCast);
        });
      case 'mastodon':
        return new Observable<Statuses>(sub => {
          const mastodonStream = webSocket<MastodonStreamEvent>({
            url: `${ environment.websocketProtocol }://${ account.address }/api/v1/streaming?access_token=${ account.token }&stream=public`,
          }).asObservable();
          this.mastodonStatusStreamSubscribe(sub, mastodonStream);
        });
    }
  }
}

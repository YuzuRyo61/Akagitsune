import { Injectable } from '@angular/core';
import { Account } from '../lib/account';
import { webSocket } from 'rxjs/webSocket';
import { MastodonStreamEvent } from '../lib/mastodon/stream';
import { Observable } from 'rxjs';
import { Statuses } from '../lib/statuses';
import { MastodonStatus } from '../lib/mastodon/status';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(
    private hc: HttpClient,
  ) {
  }

  homeTimeline(account: Account): Observable<Statuses[]> {
    switch (account.type) {
      case 'misskey':

      case 'mastodon':
        return new Observable<Statuses[]>(observer => {
          this.hc.get<MastodonStatus[]>(`https://${ account.address }/api/v1/timelines/home`, {
            headers: {
              'Authorization': `Bearer ${ account.token }`,
            },
          }).subscribe({
            next: value => {
              let data: Statuses[] = [];
              value.forEach((val, _) => {
                data.push({
                  id: val.id,
                  body: val.content,
                  user: {
                    id: val.account.id,
                    username: val.account.username,
                    display_name: val.account.display_name,
                    avatar_url: val.account.avatar,
                  },
                  cw: val.spoiler_text,
                });
              });
              observer.next(data);
              observer.complete();
            },
            error: err => {
              observer.error(err);
            },
          });
        });
    }
  }

  homeStream(account: Account): Observable<Statuses> {
    switch (account.type) {
      case 'misskey':
        // const streamMisskey = webSocket<any>({
        //   url: `wss://${ account.address }/streaming?i=${ account.token }`,
        // });
        //
        // return streamMisskey;
      case 'mastodon':
        return new Observable<Statuses>(observer => {
          webSocket<MastodonStreamEvent>({
            url: `wss://${ account.address }/api/v1/streaming?access_token=${ account.token }&stream=user`
          }).asObservable().subscribe({
            next: value => {
              if (value.payload === undefined) return;
              const status = JSON.parse(value.payload) as MastodonStatus;
              observer.next({
                id: status.id,
                body: status.content,
                cw: status.spoiler_text,
                user: {
                  id: status.account.id,
                  username: status.account.username,
                  display_name: status.account.display_name,
                  avatar_url: status.account.avatar,
                }
              });
            },
            error: err => {
              observer.error(err);
            },
            complete: () => {
              observer.complete();
            }
          });
        });
    }
  }
}

import { Injectable } from '@angular/core';
import { Account } from '../lib/account';
import { webSocket } from 'rxjs/webSocket';
import { MastodonStreamEvent } from '../lib/mastodon/stream';
import { Observable } from 'rxjs';
import { Statuses } from '../lib/statuses';
import { MastodonStatus } from '../lib/mastodon/status';
import { HttpClient } from '@angular/common/http';
import { MisskeyNote } from '../lib/misskey/note';
import { v4 as uuidV4 } from 'uuid';
import { MisskeyStreamEvent } from '../lib/misskey/stream';


@Injectable({
  providedIn: 'root',
})
export class TimelineService {

  constructor(
    private hc: HttpClient,
  ) {
  }

  homeTimeline(account: Account): Observable<Statuses[]> {
    switch (account.type) {
      case 'misskey':
        return new Observable<Statuses[]>(observer => {
          this.hc.post<MisskeyNote[]>(`https://${ account.address }/api/notes/timeline`, {
            'i': account.token,
            'limit': 20,
          }).subscribe({
            next: value => {
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
              observer.next(data);
              observer.complete();
            },
            error: err => {
              observer.error(err);
            },
          });
        });
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
                    acct: val.account.acct,
                    display_name: val.account.display_name,
                    avatar_url: val.account.avatar,
                  },
                  cw: val.spoiler_text,
                  created_at: val.created_at,
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
        return new Observable<Statuses>(observer => {
          const misskeyStream = webSocket({
            url: `wss://${ account.address }/streaming?i=${ account.token }`,
          });
          misskeyStream.next({
            type: 'connect',
            body: {
              channel: 'homeTimeline',
              id: uuidV4(),
            },
          });
          const misskeyStreamObservable = misskeyStream.asObservable() as Observable<MisskeyStreamEvent>;
          misskeyStreamObservable.subscribe({
            next: value => {
              observer.next({
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
            },
            error: err => {
              observer.error(err);
            },
            complete: () => {
              observer.complete();
            },
          });
        });
      case 'mastodon':
        return new Observable<Statuses>(observer => {
          webSocket<MastodonStreamEvent>({
            url: `wss://${ account.address }/api/v1/streaming?access_token=${ account.token }&stream=user`,
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
                  acct: status.account.acct,
                  display_name: status.account.display_name,
                  avatar_url: status.account.avatar,
                },
                created_at: status.created_at,
              });
            },
            error: err => {
              observer.error(err);
            },
            complete: () => {
              observer.complete();
            },
          });
        });
    }
  }
}

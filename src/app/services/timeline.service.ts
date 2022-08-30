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
      let pushData: Statuses = {
        id: val.id,
        cw: val.cw,
        body: val.text,
        created_at: val.createdAt,
        user: {
          id: val.user.id,
          acct: (val.user.host ? `${ val.user.username }@${ val.user.host }` : val.user.username),
          avatar_url: val.user.avatarUrl,
          display_name: val.user.name,
          bot: val.user.isBot,
          follower_count: val.user.followersCount,
          post_count: val.user.notesCount,
          following_count: val.user.followingCount,
          banner_url: val.user.bannerUrl,
          description: val.user.description,
        },
        reaction: val.reactions,
        quoteCount: val.renoteCount,
        likeCount: 0,
      };

      if (val.renote !== undefined) {
        pushData.quote = {
          id: val.renote.id,
          cw: val.renote.cw,
          body: val.renote.text,
          created_at: val.renote.createdAt,
          user: {
            id: val.renote.user.id,
            acct: (val.renote.user.host ? `${ val.renote.user.username }@${ val.renote.user.host }` : val.renote.user.username),
            avatar_url: val.renote.user.avatarUrl,
            display_name: val.renote.user.name,
            description: val.renote.user.description,
            bot: val.renote.user.isBot,
            banner_url: val.renote.user.bannerUrl,
            post_count: val.renote.user.notesCount,
            follower_count: val.renote.user.followersCount,
            following_count: val.renote.user.followingCount,
          },
          reaction: val.renote.reactions,
          quoteCount: val.renote.renoteCount,
          likeCount: 0,
        };
      }

      data.push(pushData);
    });
    sub.next(data);
  }

  private parseMisskeyNoteStream(sub: Subscriber<Statuses>, value: MisskeyStreamEvent) {
    let streamData: Statuses = {
      id: value.body.body.id,
      cw: value.body.body.cw,
      body: value.body.body.text,
      created_at: value.body.body.createdAt,
      user: {
        id: value.body.body.user.id,
        acct: (value.body.body.user.host ? `${ value.body.body.user.username }@${ value.body.body.user.host }` : value.body.body.user.username),
        display_name: value.body.body.user.name,
        avatar_url: value.body.body.user.avatarUrl,
        banner_url: value.body.body.user.bannerUrl,
        description: value.body.body.user.description,
        bot: value.body.body.user.isBot,
        following_count: value.body.body.user.followingCount,
        post_count: value.body.body.user.notesCount,
        follower_count: value.body.body.user.followersCount,
      },
      reaction: value.body.body.reactions,
      quoteCount: value.body.body.renoteCount,
      likeCount: 0,
    };

    if (value.body.body.renote !== undefined) {
      streamData.quote = {
        id: value.body.body.renote.id,
        cw: value.body.body.renote.cw,
        body: value.body.body.renote.text,
        created_at: value.body.body.renote.createdAt,
        user: {
          id: value.body.body.renote.user.id,
          acct: (value.body.body.renote.user.host ? `${ value.body.body.renote.user.username }@${ value.body.body.renote.user.host }` : value.body.body.renote.user.username),
          avatar_url: value.body.body.renote.user.avatarUrl,
          display_name: value.body.body.renote.user.name,
          banner_url: value.body.body.renote.user.bannerUrl,
          description: value.body.body.renote.user.description,
          bot: value.body.body.renote.user.isBot,
          post_count: value.body.body.renote.user.notesCount,
          follower_count: value.body.body.renote.user.followersCount,
          following_count: value.body.body.renote.user.followingCount,
        },
        reaction: value.body.body.renote.reactions,
        quoteCount: value.body.body.renote.renoteCount,
        likeCount: 0,
      };
    }

    sub.next(streamData);
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
      let pushData: Statuses = {
        id: val.id,
        body: val.content,
        user: {
          id: val.account.id,
          acct: val.account.acct,
          display_name: val.account.display_name,
          avatar_url: val.account.avatar,
          banner_url: val.account.header,
          bot: val.account.bot,
          description: val.account.note,
          post_count: val.account.statuses_count,
          following_count: val.account.following_count,
          follower_count: val.account.followers_count,
        },
        cw: val.spoiler_text,
        created_at: val.created_at,
        quoteCount: val.reblogs_count,
        likeCount: val.favourites_count,
      };

      if (val.reblog !== null) {
        pushData.quote = {
          id: val.reblog.id,
          body: val.reblog.content,
          user: {
            id: val.reblog.account.id,
            acct: val.reblog.account.acct,
            display_name: val.reblog.account.display_name,
            avatar_url: val.reblog.account.avatar,
            banner_url: val.reblog.account.header,
            description: val.reblog.account.note,
            bot: val.reblog.account.bot,
            post_count: val.reblog.account.statuses_count,
            follower_count: val.reblog.account.followers_count,
            following_count: val.reblog.account.following_count,
          },
          cw: val.reblog.spoiler_text,
          created_at: val.reblog.created_at,
          quoteCount: val.reblog.reblogs_count,
          likeCount: val.reblog.favourites_count,
        };
      }

      data.push(pushData);
    });
    sub.next(data);
  }

  private parseMastodonStatusStream(sub: Subscriber<Statuses>, value: MastodonStatus) {
    let data: Statuses = {
      id: value.id,
      body: value.content,
      cw: value.spoiler_text,
      user: {
        id: value.account.id,
        acct: value.account.acct,
        display_name: value.account.display_name,
        avatar_url: value.account.avatar,
        banner_url: value.account.header,
        following_count: value.account.following_count,
        post_count: value.account.statuses_count,
        bot: value.account.bot,
        follower_count: value.account.followers_count,
        description: value.account.note,
      },
      created_at: value.created_at,
      quoteCount: value.reblogs_count,
      likeCount: value.favourites_count,
    };

    if (value.reblog !== null) {
      data.quote = {
        id: value.reblog.id,
        body: value.reblog.content,
        user: {
          id: value.reblog.account.id,
          acct: value.reblog.account.acct,
          display_name: value.reblog.account.display_name,
          avatar_url: value.reblog.account.avatar,
          banner_url: value.reblog.account.header,
          bot: value.reblog.account.bot,
          description: value.reblog.account.note,
          post_count: value.reblog.account.statuses_count,
          follower_count: value.reblog.account.followers_count,
          following_count: value.reblog.account.following_count,
        },
        cw: value.reblog.spoiler_text,
        created_at: value.reblog.created_at,
        quoteCount: value.reblog.reblogs_count,
        likeCount: value.favourites_count,
      };
    }

    sub.next(data);
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

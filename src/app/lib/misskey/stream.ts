import { MisskeyNote } from './note';


export interface MisskeyStreamEvent {
  type: 'channel';
  body: {
    id: string;
    type: 'note';
    body: MisskeyNote;
  }
}

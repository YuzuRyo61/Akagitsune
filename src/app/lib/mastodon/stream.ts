export interface MastodonStreamEvent {
  event: 'update' | 'notification' | 'delete' | 'filters_changed';
  payload?: string;
}

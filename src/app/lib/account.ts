import { AccountType } from './account-type';

export interface Account {
  id: string;
  acct: string;
  type: AccountType;
  token: string;
}

import { AccountType } from './account-type';

export interface Account {
  address: string;
  type: AccountType;
  token: string;
}

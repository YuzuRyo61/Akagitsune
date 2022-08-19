import { AccountType } from './account-type';

export interface Account {
  id: string;
  address: string;
  type: AccountType;
  token: string;
}

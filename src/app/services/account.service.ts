import { Injectable } from '@angular/core';
import { Account } from '../lib/account';
import { v4 as uuidV4 } from 'uuid';
import { AccountType } from '../lib/account-type';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() { }

  fetchAccounts(): Account[] {
    const storage = localStorage.getItem('accounts');
    if (storage === null) return [];

    return JSON.parse(storage) as Account[];
  }

  private saveAccount(data: Account[]) {
    localStorage.setItem('accounts', JSON.stringify(data));
  }

  addAccount(
    acct: string,
    type: AccountType,
    token: string,
  ): Account[] {
    const newAccount: Account = {
      id: uuidV4(),
      acct,
      type,
      token,
    }

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

}

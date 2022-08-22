import { Injectable } from '@angular/core';
import { Column } from '../lib/column';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private _column: Column[] = [];

  constructor() { }

  get column(): Column[] {
    return this._column;
  }

  loadColumns() {
    const storage = localStorage.getItem('columns');
    if (storage === null) return;

    this._column = JSON.parse(storage);
  }

  private saveColumns() {
    localStorage.setItem('columns', JSON.stringify(this._column));
  }

  addColumn(column: Column) {
    this._column.push(column);
    this.saveColumns();
  }

  removeColumn(key: number) {
    this._column.splice(key, 1);
    this.saveColumns();
  }

  purgeColumnAccount(accountId: string) {
    this._column = this._column.filter((value) => value.account !== accountId);
  }
}

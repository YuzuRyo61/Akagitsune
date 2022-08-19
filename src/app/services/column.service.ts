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
}

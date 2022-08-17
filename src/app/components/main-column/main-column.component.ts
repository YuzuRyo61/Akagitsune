import { Component, OnInit } from '@angular/core';
import { v4 as uuidV4 } from 'uuid';

@Component({
  selector: 'app-main-column',
  templateUrl: './main-column.component.html',
  styleUrls: ['./main-column.component.scss']
})
export class MainColumnComponent implements OnInit {
  private _collapseId?: string;

  constructor() { }

  get collapseId(): string {
    if (this._collapseId === undefined) return 'unknown';
    return this._collapseId;
  }

  ngOnInit(): void {
    this._collapseId = uuidV4();
  }

}

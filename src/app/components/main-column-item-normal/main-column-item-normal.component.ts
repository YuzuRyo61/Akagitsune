import { Component, Input } from '@angular/core';
import { Statuses } from '../../lib/statuses';
import { Account } from '../../lib/account';

@Component({
  selector: 'app-main-column-item-normal',
  templateUrl: './main-column-item-normal.component.html',
  styleUrls: ['./main-column-item-normal.component.scss']
})
export class MainColumnItemNormalComponent {
  @Input() item?: Statuses;
  @Input() account?: Account;

  constructor() { }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../lib/account';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.scss']
})
export class AComponent implements OnInit {
  account?: Account;

  constructor(
    public route: ActivatedRoute,
    private acs: AccountService,
  ) {
  }

  ngOnInit() {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId === null) return;
    this.account = this.acs.account.get(accountId);
  }
}

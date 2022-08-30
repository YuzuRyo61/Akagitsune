import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { User } from '../../../../lib/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class AUserComponent implements OnInit {
  user?: User;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private acs: AccountService,
  ) { }

  ngOnInit(): void {
    const accountId = this.route.parent?.snapshot.paramMap.get('accountId');
    if (accountId === undefined || accountId === null) return;

    this.route.paramMap.subscribe({
      next: paramMap => {
        this.user = undefined;
        this.error = false;

        const userId = paramMap.get('userId');
        if (userId === null) {
          this.error = true;
          return;
        }

        const userObservable = this.acs.getUser(accountId, userId);
        if (userObservable === undefined) {
          this.error = true;
          return;
        }

        userObservable.subscribe({
          next: value => {
            this.user = value;
          },
        });
      },
    });
  }

}

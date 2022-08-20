import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { Account } from '../../lib/account';
import { ColumnType } from '../../lib/column-type';
import { StepperComponent } from '../../components/stepper/stepper.component';
import { ColumnService } from '../../services/column.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  targetAccountId: string = '';
  targetColumnType?: ColumnType;

  @ViewChild('stepper') stepper?: StepperComponent;

  private escShortcut?: Hotkey;

  constructor(
    public acs: AccountService,
    private hks: HotkeysService,
    private router: Router,
    private cs: ColumnService,
  ) {
  }

  ngOnInit() {
    this.escShortcut = new Hotkey('esc', (_: KeyboardEvent): boolean => {
      this.router.navigate(['/']).then(() => {
        if (this.escShortcut) this.hks.remove(this.escShortcut);
      });
      return false;
    });

    this.hks.add(this.escShortcut);
  }

  get targetAccount(): Account | undefined {
    return this.acs.account.get(this.targetAccountId);
  }

  changeEvent(value: string) {
    switch (value) {
      case '@!add':
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate(['/', 'accounts', 'add']);
        break;
      case '@!manage':
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate(['/', 'accounts', 'list']);
    }
  }

  selectColumnType(type: ColumnType) {
    this.targetColumnType = type;
    this.stepper?.next();
  }

  addColumn() {
    if (this.targetColumnType === undefined) return;

    this.cs.addColumn({
      type: this.targetColumnType,
      account: this.targetAccountId,
    });
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/']);
  }
}

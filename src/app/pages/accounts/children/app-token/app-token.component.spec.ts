import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAppTokenComponent } from './app-token.component';

describe('AppTokenComponent', () => {
  let component: AccountAppTokenComponent;
  let fixture: ComponentFixture<AccountAppTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAppTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAppTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

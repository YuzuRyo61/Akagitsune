import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUserComponent } from './user.component';

describe('UserComponent', () => {
  let component: AUserComponent;
  let fixture: ComponentFixture<AUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

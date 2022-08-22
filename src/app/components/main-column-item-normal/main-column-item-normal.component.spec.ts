import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainColumnItemNormalComponent } from './main-column-item-normal.component';

describe('MainColumnItemNormalComponent', () => {
  let component: MainColumnItemNormalComponent;
  let fixture: ComponentFixture<MainColumnItemNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainColumnItemNormalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainColumnItemNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

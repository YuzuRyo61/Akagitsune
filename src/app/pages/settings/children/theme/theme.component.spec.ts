import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSettingsComponent } from './theme.component';

describe('ThemeComponent', () => {
  let component: ThemeSettingsComponent;
  let fixture: ComponentFixture<ThemeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

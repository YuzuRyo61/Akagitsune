import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APostComponent } from './post.component';

describe('PostComponent', () => {
  let component: APostComponent;
  let fixture: ComponentFixture<APostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ APostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

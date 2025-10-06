import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearprofileComponent } from './learprofile.component';

describe('LearprofileComponent', () => {
  let component: LearprofileComponent;
  let fixture: ComponentFixture<LearprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

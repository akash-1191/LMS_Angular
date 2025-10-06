import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsEnrollmentsComponent } from './students-enrollments.component';

describe('StudentsEnrollmentsComponent', () => {
  let component: StudentsEnrollmentsComponent;
  let fixture: ComponentFixture<StudentsEnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsEnrollmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

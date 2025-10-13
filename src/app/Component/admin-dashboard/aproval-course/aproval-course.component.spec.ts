import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovalCourseComponent } from './aproval-course.component';

describe('AprovalCourseComponent', () => {
  let component: AprovalCourseComponent;
  let fixture: ComponentFixture<AprovalCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovalCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprovalCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

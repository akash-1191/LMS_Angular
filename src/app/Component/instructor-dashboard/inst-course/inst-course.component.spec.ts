import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstCourseComponent } from './inst-course.component';

describe('InstCourseComponent', () => {
  let component: InstCourseComponent;
  let fixture: ComponentFixture<InstCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

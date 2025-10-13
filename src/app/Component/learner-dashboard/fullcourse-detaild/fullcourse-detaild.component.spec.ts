import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcourseDetaildComponent } from './fullcourse-detaild.component';

describe('FullcourseDetaildComponent', () => {
  let component: FullcourseDetaildComponent;
  let fixture: ComponentFixture<FullcourseDetaildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullcourseDetaildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullcourseDetaildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

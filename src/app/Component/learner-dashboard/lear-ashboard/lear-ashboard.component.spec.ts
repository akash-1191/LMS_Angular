import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearAshboardComponent } from './lear-ashboard.component';

describe('LearAshboardComponent', () => {
  let component: LearAshboardComponent;
  let fixture: ComponentFixture<LearAshboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearAshboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearAshboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

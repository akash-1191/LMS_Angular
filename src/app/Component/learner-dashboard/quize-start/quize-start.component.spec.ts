import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizeStartComponent } from './quize-start.component';

describe('QuizeStartComponent', () => {
  let component: QuizeStartComponent;
  let fixture: ComponentFixture<QuizeStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizeStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

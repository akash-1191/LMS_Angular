import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MylmsserviecsComponent } from './mylmsserviecs.component';

describe('MylmsserviecsComponent', () => {
  let component: MylmsserviecsComponent;
  let fixture: ComponentFixture<MylmsserviecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MylmsserviecsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MylmsserviecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

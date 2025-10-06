import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDashborrdComponent } from './adm-dashborrd.component';

describe('AdmDashborrdComponent', () => {
  let component: AdmDashborrdComponent;
  let fixture: ComponentFixture<AdmDashborrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmDashborrdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmDashborrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

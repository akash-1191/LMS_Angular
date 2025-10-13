import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-add-unit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-unit.component.html',
  styleUrl: './add-unit.component.css'
})
export class AddUnitComponent implements OnInit {


  unitForm!: FormGroup;
  quizForm!: FormGroup;
  courseId!: number;

  successMessage: string = '';
  errorMessage: string = '';
  showNextButton: boolean = false;
  quizId!: number | null;
  isAddUnitDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lmsService: LmsservicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.quizId = null;

    this.unitForm = this.fb.group({
      units: this.fb.array([this.createUnitGroup(1)])
    });

    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      duration: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]+$')
      ]]
    });
  }

  get units(): FormArray {
    return this.unitForm.get('units') as FormArray;
  }

  createUnitGroup(order: number): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      order: [{ value: order, disabled: true }]
    });
  }

  addUnit() {
    const nextOrder = this.units.length + 1;
    this.units.push(this.createUnitGroup(nextOrder));
  }

  removeUnit(index: number) {
    if (this.units.length > 1) {
      this.units.removeAt(index);
      this.updateOrders();
    }
  }

  updateOrders() {
    this.units.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  onSubmitUnits() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      return;
    }

    const payloads = this.units.getRawValue().map((unit: any, index: number) => ({
      ...unit,
      order: index + 1,
      courseId: this.courseId
    }));

    const requests = payloads.map((payload: any) =>
      this.lmsService.addUnit(payload)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.successMessage = ' All units added successfully.';

        this.unitForm.setControl('units', this.fb.array([this.createUnitGroup(1)]));
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to add units.';
        this.clearMessagesAfterDelay();
      }
    });
  }

  onSubmitQuiz() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const quizPayload = {
      ...this.quizForm.value,
      duration: Number(this.quizForm.value.duration),
      courseId: this.courseId
    };

    this.lmsService.createQuiz(quizPayload).subscribe({
      next: (res: any) => {
        this.successMessage = ' Quiz created successfully.';
        this.quizId = res.quizId || res.id || null;
        // this.clearMessagesAfterDelay();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err?.error?.message || ' Failed to create quiz.';
        this.clearMessagesAfterDelay();
      }
    });
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  goToNextStep() {
    this.router.navigate(['/instructor-dashboard/unit', this.courseId, 'add-content', this.quizId]);
  }
}
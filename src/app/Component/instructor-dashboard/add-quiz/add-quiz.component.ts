import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';

@Component({
  selector: 'app-add-quiz',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.css'
})
export class AddQuizComponent implements OnInit {

 quizForm!: FormGroup;
  courseId!: number;

  units: any[] = [];
  quizzes: any[] = [];

  successMessage = '';
  errorMessage = '';
  isAddQuestionsDisabled = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lmsService: LmsservicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    this.quizForm = this.fb.group({
      unitId: ['', Validators.required],
      title: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
    });

    this.loadUnitsAndQuizzes();
  }

  loadUnitsAndQuizzes() {
    this.lmsService.getUnitsByCourse(this.courseId).subscribe({
      next: (units) => {
        this.units = units;

        this.lmsService.getQuizzesByCourse(this.courseId).subscribe({
          next: (quizzesData: any[]) => {
            this.quizzes = Array.isArray(quizzesData) ? quizzesData : [];

            // Calculate units with no quiz
            const availableUnits = this.units.filter(u => !this.quizzes.some(q => q.unitId === u.unitId));

            // Enable Add Questions only if all units have quizzes (no available units)
            this.isAddQuestionsDisabled = availableUnits.length > 0;
          },
          error: () => {
            this.errorMessage = 'Failed to load quizzes.';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Failed to load units.';
      }
    });
  }

  isUnitQuizCreated(unitId: number): boolean {
    return Array.isArray(this.quizzes) && this.quizzes.some(q => q.unitId === unitId);
  }

  get availableUnits() {
    return this.units.filter(u => !this.isUnitQuizCreated(u.unitId));
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.quizForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.autoHideMessages();
      return;
    }

    const payload = {
      ...this.quizForm.value
    };


    this.lmsService.createQuiz(payload).subscribe({
      next: () => {
        this.successMessage = 'Quiz created successfully!';
        this.quizForm.reset();
        this.loadUnitsAndQuizzes();  
        this.autoHideMessages();
      },
      error: (err) => {
        console.log(err.error);
        this.errorMessage = err.error?.message || 'Failed to create quiz.';
        this.autoHideMessages();
      }
    });
  }

  autoHideMessages() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  onAddQuestionsClick() {
    this.router.navigate(['/quiz', this.courseId, 'add-questions']);
  }
}

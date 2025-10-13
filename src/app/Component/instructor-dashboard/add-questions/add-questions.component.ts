import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-questions',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-questions.component.html',
  styleUrl: './add-questions.component.css'
})
export class AddQuestionsComponent  implements OnInit {
  questionForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private lmsService: LmsservicesService) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      options: ['', [Validators .required]],
      correctAnswer: ['', Validators.required],
      quizId: [1], // Replace with actual quizId, or fetch from route/parent component
    });
  }

  onSubmit() {
    if (this.questionForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const formValue = this.questionForm.value;

    // Basic JSON check for options (optional, you can enhance validation)
    try {
      JSON.parse(formValue.options);
    } catch {
      this.errorMessage = 'Options must be a valid JSON array.';
      this.isLoading = false;
      return;
    }

    this.lmsService.createQuestion(formValue).subscribe({
      next: (res) => {
        this.successMessage = 'Question added successfully!';
        this.errorMessage = '';
        this.isLoading = false;
        this.questionForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add question.';
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }
}
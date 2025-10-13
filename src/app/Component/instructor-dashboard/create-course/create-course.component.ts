import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-course',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent {

  courseForm!: FormGroup;
  selectedFile!: File;
  thumbnailError: string = '';
  backendError: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private lmsService: LmsservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.thumbnailError = 'Only JPG, JPEG, PNG are allowed.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.thumbnailError = 'Thumbnail size cannot exceed 5MB.';
      return;
    }

    this.selectedFile = file;
    this.thumbnailError = '';
  }

  onSubmit(): void {
    this.backendError = '';
    this.successMessage = '';

    if (this.courseForm.invalid || !this.selectedFile) {
      this.thumbnailError = 'Thumbnail is required.';
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.courseForm.get('title')?.value);
    formData.append('Description', this.courseForm.get('description')?.value);
    formData.append('ThumbnailUrl', this.selectedFile);

    this.lmsService.createCourse(formData).subscribe({
      next: (res) => {
        this.successMessage = 'Course created successfully!';
        setTimeout(() => {
          this.router.navigate(['/instructor-dashboard/course', res.courseId, 'add-unit']);
        }, 1500); 
      },
      error: (err) => {
        this.backendError = err.error?.message || 'Something went wrong while creating the course.';
        console.error('Error:', err);
      }
    });
  }
}

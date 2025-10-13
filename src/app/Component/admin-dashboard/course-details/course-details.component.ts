import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {

  courseId!: number;
  course: any;
  isLoading = false;
  errorMessage = '';

  showVideoModal = false;
  selectedVideoUrl: string | null = null;

  openedQuestions: { [key: number]: boolean } = {};

  showRejectModal = false;
  rejectForm!: FormGroup;

  successMessage = '';
  errorMessagemodel = '';

  constructor(
    private route: ActivatedRoute,
    private services: LmsservicesService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (id) {
      this.courseId = Number(id);
      this.loadCourseDetail();
    } else {
      this.errorMessage = 'Course ID missing in route!';
    }
  }

  loadCourseDetail(): void {
    this.isLoading = true;
    this.services.getInstructorCourseById(this.courseId).subscribe({
      next: (res) => {
        this.course = res;
        this.course.quizzes?.forEach((quiz: any) => {
          quiz.questions?.forEach((q: any) => {
            if (typeof q.options === 'string') {
              try {
                q.options = JSON.parse(q.options);
              } catch (e) {
                q.options = [];
              }
            }
          });
        });

        this.rejectForm = this.fb.group({
          reason: ['', Validators.required]
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.errorMessage = 'Failed to load course details';
        this.isLoading = false;
      }
    });
  }

  openVideoModal(videoUrl: string) {
    this.selectedVideoUrl = 'https://localhost:7000' + videoUrl;
    this.showVideoModal = true;
  }

  closeVideoModal() {
    this.showVideoModal = false;
    this.selectedVideoUrl = null;
  }


  toggleQuestion(qId: number) {
    this.openedQuestions[qId] = !this.openedQuestions[qId];
  }

  isQuestionOpen(qId: number): boolean {
    return !!this.openedQuestions[qId];
  }


  acceptCourse() {
    console.log("click");
    this.services.approveCourse(this.courseId).subscribe({
      next: () => {
        this.successMessage = 'Course approved successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.loadCourseDetail();
      },
      error: (err) => {
        console.error(err);
        this.errorMessagemodel = 'Failed to approve course';
        setTimeout(() => this.errorMessagemodel = '', 3000);
      }
    });
  }
  isApproved(): boolean {
    return this.course?.approvalStatus === 'Approved';
  }

  openRejectModal() {
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.rejectForm.reset();
  }

  submitReject() {
    if (this.rejectForm.invalid) return;

    const reason = this.rejectForm.get('reason')?.value;

    this.services.rejectCourse(this.courseId, reason).subscribe({
      next: () => {
        this.successMessage = 'Course rejected successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.closeRejectModal();
        this.loadCourseDetail();
      },
      error: (err) => {
        console.error(err);
        this.errorMessagemodel = 'Failed to reject course';
        setTimeout(() => this.errorMessagemodel = '', 3000);
      }
    });
  }


}

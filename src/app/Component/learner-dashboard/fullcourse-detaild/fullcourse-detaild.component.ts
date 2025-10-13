import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fullcourse-detaild',
  imports: [CommonModule],
  templateUrl: './fullcourse-detaild.component.html',
  styleUrl: './fullcourse-detaild.component.css'
})
export class FullcourseDetaildComponent implements OnInit {

  courseId!: number;
  course: any;
  activeTab: 'course' | 'instructor' = 'course';
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private service: LmsservicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadCourse();
  }

  loadCourse() {
    this.isLoading = true;
    this.service.getLearnerCourseById(this.courseId).subscribe({
      next: (res) => {
        this.course = res;

        // Convert quiz options from string to array if needed
        this.course.quizzes?.forEach((quiz: any) => {
          if (quiz.options && typeof quiz.options === 'string') {
            try { quiz.options = JSON.parse(quiz.options); }
            catch { quiz.options = []; }
          }
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load course details';
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: 'course' | 'instructor') {
    this.activeTab = tab;
  }

  enrollCourse() {
  this.service.enrollCourse(this.course.courseId).subscribe({
    next: (res) => {
      this.router.navigate(['/learner-dashboard/mycourse'], { queryParams: { courseId: this.courseId } });
    },
    error: (err) => {
      console.error(err);
      if (err.status === 400) {
        this.errorMessage = "You are already enrolled in this course.";
      } else {
        this.errorMessage = "Something went wrong. Please try again.";
      }
    }
  });
  }
}
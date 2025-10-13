import { Component, OnInit } from '@angular/core';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {

  courses: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private service: LmsservicesService, private router: Router) { }

  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses() {
    this.isLoading = true;
    this.service.getEnrolledCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load enrolled courses';
        this.isLoading = false;
      }
    });
  }

  viewCourse(courseId: number) {
    this.router.navigate([`/learner-dashboard/startlearning/${courseId}`]);
  }
}
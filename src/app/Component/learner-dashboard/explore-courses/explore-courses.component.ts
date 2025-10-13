import { Component, OnInit } from '@angular/core';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-courses',
  imports: [CommonModule],
  templateUrl: './explore-courses.component.html',
  styleUrl: './explore-courses.component.css'
})
export class ExploreCoursesComponent implements OnInit {

  courses: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private services: LmsservicesService, private router: Router) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.services.getAllCoursesForStudent().subscribe({
      next: (res) => {
        console.log(res);
        this.courses = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load courses';
        this.isLoading = false;
      }
    });
  }

  viewFullCourse(courseId: number) {
    this.router.navigate([`/learner-dashboard/course-details/${courseId}`]);
  }



   enrollCourse(courseId: number) {
    // this.services.enrollCourse(courseId).subscribe({
    //   next: () => {
    //     this.successMessage = 'Enrolled successfully!';
    //     setTimeout(() => this.successMessage = '', 3000);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.errorMessage = 'Enrollment failed!';
    //     setTimeout(() => this.errorMessage = '', 3000);
    //   }
    // });
   }
}

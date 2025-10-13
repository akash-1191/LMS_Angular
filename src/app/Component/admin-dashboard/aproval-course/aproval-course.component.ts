import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aproval-course',
  imports: [CommonModule],
  templateUrl: './aproval-course.component.html',
  styleUrl: './aproval-course.component.css'
})
export class AprovalCourseComponent implements OnInit {

   instructorId!: number;
  courses: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private services: LmsservicesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('instructorId');
    if (id) {
      this.instructorId = Number(id);
      this.loadCoursesByInstructor();
    } else {
      this.errorMessage = 'Instructor ID missing in route!';
    }
  }

  loadCoursesByInstructor() {
    this.isLoading = true;
    this.services.getInstructorCoursesByAdmin(this.instructorId).subscribe({
      next: (res) => {
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

  viewMore(courseId: number) {
    this.router.navigate(['/admin-dashboard/course-details', courseId]);
  }
}

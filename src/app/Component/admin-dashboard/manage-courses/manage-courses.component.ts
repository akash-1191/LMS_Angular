import { Component, OnInit } from '@angular/core';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-courses',
  imports: [CommonModule],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css'
})
export class ManageCoursesComponent implements OnInit {

  instructors: any[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(private adminService: LmsservicesService, private router: Router) { }

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors() {
    this.isLoading = true;
    this.adminService.getAllInstructorsData().subscribe({
      next: (res) => {
        console.log(res);
        this.instructors = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load instructors.';
        this.isLoading = false;
      }
    });
  }

  viewCourses(instructorId: number) {
    this.router.navigate(['/admin-dashboard/approvalcourse', instructorId]);
  }
}

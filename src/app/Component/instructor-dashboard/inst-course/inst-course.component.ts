import { Component, OnInit } from '@angular/core';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inst-course',
  imports: [CommonModule,RouterLink],
  templateUrl: './inst-course.component.html',
  styleUrl: './inst-course.component.css'
})
export class InstCourseComponent implements OnInit {

   courses: any[] = [];
  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(private courseService: LmsservicesService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.courseService.getInstructorAllCourses().subscribe({
      next: (res) => {
       
        this.courses = res || [];  
        this.isLoading = false;
        this.hasError = false;
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }
}

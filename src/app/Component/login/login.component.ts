import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LmsservicesService } from '../../../services/lmsservices.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private lmsService: LmsservicesService
  ) { }

  ngOnInit(): void {

    const role = sessionStorage.getItem('role');
    if (role) {
      switch (role) {
        case 'Admin':
          this.router.navigate(['/admin-dashboard']);
          return;
        case 'Instructor':
          this.router.navigate(['/instructor-dashboard']);
          return;
        case 'Learner':
          this.router.navigate(['/learner-dashboard']);
          return;
      }
    }


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
        ]
      ]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    this.lmsService.Login(this.loginForm.value).subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token.token);
        sessionStorage.setItem('userId', res.token.user.userId);
        sessionStorage.setItem('role', res.token.user.role);

        switch (res.token.user.role) {
          case 'Admin':
            this.router.navigate(['/admin-dashboard'], { replaceUrl: true });
            break;
          case 'Instructor':
            this.router.navigate(['/instructor-dashboard'], { replaceUrl: true });
            break;
          case 'Learner':
            this.router.navigate(['/learner-dashboard'], { replaceUrl: true });
            break;
          default:
            this.router.navigate(['/unauthorized'], { replaceUrl: true });
            break;
        }
      },
      error: (err) => {
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        console.error(err);
      }
    });
  }
}
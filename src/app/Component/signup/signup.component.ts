import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LmsservicesService } from '../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(private fb: FormBuilder, private router: Router, private service: LmsservicesService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      role: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.matchPasswords('password', 'confirmPassword')
    });
  }

  // Password match validator
  matchPasswords(pass: string, confirmPass: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[pass];
      const confirmPasswordControl = formGroup.controls[confirmPass];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.signupForm.invalid) return;
    const roleId = Number(this.signupForm.value.role);
    const data = {
      fullName: this.signupForm.value.fullName,
      email: this.signupForm.value.email.toLowerCase(),
      password: this.signupForm.value.password,
      roleId: roleId
    };
    

    this.service.registration(data,{ responseType: 'text' }).subscribe({
      next: (res) => {
        console.log('Registration success:', res);

        const role = this.signupForm.value.role;
        if (role === 2) {
          this.router.navigate(['/instructor-dashboard']);
        } else if (role === 3) {
          this.router.navigate(['/learner-dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Registration failed:', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}

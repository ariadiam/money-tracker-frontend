import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  registerForm!: ReturnType<FormBuilder['group']>;

   constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  this.registerForm = this.fb.group(
    {
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: [''],
    },
    { validators: matchPasswords }
  );
}

  onSubmit() {
  this.submitted = true;
  if (this.registerForm.invalid) return;

  const { firstname, lastname, username, email, phone, password } = this.registerForm.value;
  this.authService.register({
    firstname,
    lastname,
    username,
    email,
    phone: phone ? [{ type: 'mobile', number: phone }] : [],
    password
  }).subscribe({
    next: (res) => {
      console.log('Registration success:', res);
      this.successMessage = 'Account created! You can now log in.';
      // this.router.navigate(['/login']);
    },
    error: (err) => {
    console.error('Registration error:', err);
    this.errorMessage =
      err?.error?.message ||
      err?.message ||
      'Registration failed. Please try again.';
    }
  });
}
  continueWithGoogle(): void {
    window.location.href = 'http://localhost:3000/api/auth/google/callback';
  }
}

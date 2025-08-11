import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

   onSubmit() {
    if (this.registerForm.valid) {
      const userData: User = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (res) => console.log('Registration success:', res),
        error: (err) => console.error('Registration error:', err)
      });
    }
  }
}
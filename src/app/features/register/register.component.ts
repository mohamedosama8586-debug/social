import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

import { Router, RouterLink } from '@angular/router';
import { email } from '@angular/forms/signals';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isloading = signal(false);
  msgText = signal('');
  private readonly fb = inject(FormBuilder);

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
        ],
      ],
      rePassword: ['', Validators.required],
    },
    { validators: this.confirmPassword },
  );

  // registerForm = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //   username: new FormControl(''),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   dateOfBirth: new FormControl('', Validators.required),
  //   gender: new FormControl('', Validators.required),
  //   password: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
  //   ]),
  //   rePassword: new FormControl('', Validators.required),
  // });

  confirmPassword(group: AbstractControl) {
    let passowrd = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;

    if (passowrd != rePassword) return { mismatch: true };
    else {
      return null;
    }
  }

  sentRigesterData(): void {
    if (this.registerForm.valid) {
      this.isloading.set(true);
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.msgText.set(err.error.message);
          this.isloading.set(false);
        },
      });
    }
  }
}

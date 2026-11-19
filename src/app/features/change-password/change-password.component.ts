import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ChangeService } from './change.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly changeService = inject(ChangeService);
  private readonly router = inject(Router);

  loading = false;
  successMessage = '';
  errorMessage = '';

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  changePasswordForm = this.fb.group(
    {
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!confirmPassword) return null;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  submitChangePassword(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { password, newPassword } = this.changePasswordForm.getRawValue();

    this.changeService
      .changePassword({
        password: password!,
        newPassword: newPassword!,
      })
      .subscribe({
        next: (res) => {
          console.log(res);

          this.loading = false;

          this.successMessage = 'Password changed successfully!';

          this.changePasswordForm.reset();

          localStorage.removeItem('token');
          localStorage.removeItem('user');

          this.router.navigate(['/auth/login']);
        },
      });
  }
}

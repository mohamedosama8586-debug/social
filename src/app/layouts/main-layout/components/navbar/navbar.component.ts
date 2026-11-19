import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ProfileService } from './../../../../features/profile/profile.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);

  currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  selectedPhoto: File | null = null;
  photoPreview = '';
  uploading = signal(false);

  ngOnInit(): void {
    initFlowbite();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      this.photoPreview = URL.createObjectURL(this.selectedPhoto);
      this.uploadPhoto();
    }
  }

  uploadPhoto(): void {
    if (!this.selectedPhoto) return;

    this.uploading.set(true);

    this.profileService.uploadProfilePhoto(this.selectedPhoto).subscribe({
      next: () => {
        this.profileService.getMyProfile().subscribe({
          next: (res) => {
            this.currentUser = res.data.user;

            localStorage.setItem('user', JSON.stringify(this.currentUser));

            // Notify Comments component
            window.dispatchEvent(
              new CustomEvent('profilePhotoUpdated', {
                detail: this.currentUser,
              }),
            );

            this.selectedPhoto = null;
            this.photoPreview = '';
            this.uploading.set(false);
          },
          error: (err) => {
            console.log(err);
            this.uploading.set(false);
          },
        });
      },
      error: (err) => {
        console.log(err);
        this.uploading.set(false);
      },
    });
  }

  logOut(): void {
    this.authService.logOut();
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';

import { ProfileService } from './profile.service';

import { User } from './user.interface';
import { Bookmark, Post } from './postuser.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  profile = signal<User | null>(null);

  myPosts = signal<Post[]>([]);
  savedPosts = signal<Bookmark[]>([]);

  activeTab = signal<'posts' | 'saved'>('posts');

  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.getProfile();
    this.getBookmarks();
  }
  getProfile(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        const user = res.data.user;

        this.profile.set(user);

        const oldUser = JSON.parse(localStorage.getItem('user') || '{}');

        localStorage.setItem(
          'user',
          JSON.stringify({
            ...oldUser,
            photo: user.photo,
            name: user.name,
          }),
        );

        this.getMyPosts(user._id);

        this.loading.set(false);
      },

      error: (err) => {
        console.log(err);
        this.errorMessage.set('Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  getMyPosts(userId: string): void {
    this.profileService.getUserPosts(userId).subscribe({
      next: (res) => {
        this.myPosts.set(res.data.posts);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  getBookmarks(): void {
    this.profileService.getBookmarks().subscribe({
      next: (res) => {
        this.savedPosts.set(res.data.bookmarks);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  changeTab(tab: 'posts' | 'saved'): void {
    this.activeTab.set(tab);
  }

  followUser(userId: string): void {
    this.profileService.followUser(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.getProfile();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
  selectedPhoto: File | null = null;
  photoPreview = '';

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      this.photoPreview = URL.createObjectURL(this.selectedPhoto);
    }
  }

  uploadPhoto(): void {
    if (!this.selectedPhoto) return;

    this.profileService.uploadProfilePhoto(this.selectedPhoto).subscribe({
      next: (res) => {
        console.log(res);

        this.selectedPhoto = null;
        this.photoPreview = '';

        this.getProfile();
      },
      error: (err) => console.log(err),
    });
  }
}

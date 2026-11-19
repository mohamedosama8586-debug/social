import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  private get header() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
  }

  getMyProfile(): Observable<any> {
    return this.http.get(environment.baseUrl + 'users/profile-data', this.header);
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get(environment.baseUrl + `users/${userId}/profile`, this.header);
  }

  getUserPosts(userId: string): Observable<any> {
    return this.http.get(environment.baseUrl + `users/${userId}/posts`, this.header);
  }

  getBookmarks(): Observable<any> {
    return this.http.get(environment.baseUrl + 'users/bookmarks', this.header);
  }

  followUser(userId: string): Observable<any> {
    return this.http.put(environment.baseUrl + `users/${userId}/follow`, {}, this.header);
  }
  uploadProfilePhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);

    return this.http.put(environment.baseUrl + 'users/upload-photo', formData, this.header);
  }
}

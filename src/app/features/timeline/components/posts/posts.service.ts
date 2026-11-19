import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  header = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts`, this.header);
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${postId}`, this.header);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `posts/${postId}`, this.header);
  }

  createPost(data: FormData): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts`, data, this.header);
  }

  updatePost(postId: string, data: FormData): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}`, data, this.header);
  }
  sharePost(postId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/share`, {}, this.header);
  }

  likePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/like`, {}, this.header);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient = inject(HttpClient);

  header = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  getAllComments(postId: string, page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `posts/${postId}/comments?page=${page}&limit=${limit}`,
      this.header,
    );
  }

  createComment(postId: string, content: string): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `posts/${postId}/comments`,
      { content },
      this.header,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(
      environment.baseUrl + `posts/${postId}/comments/${commentId}`,
      this.header,
    );
  }
  updateComment(postId: string, commentId: string, content: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `posts/${postId}/comments/${commentId}`,
      { content },
      this.header,
    );
  }
}

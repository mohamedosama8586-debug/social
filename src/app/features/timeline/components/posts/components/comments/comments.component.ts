import { Component, inject, input, OnInit, signal, HostListener } from '@angular/core';

import { CommentService } from '../../comment.service';
import { Comment } from '../../models/comment.interface';

import {
  FormControl,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  selector: 'app-comments',
  styleUrl: './comments.component.css',
  templateUrl: './comments.component.html',
})
export class CommentsComponent implements OnInit {
  private readonly commentService = inject(CommentService);

  postId = input.required<string>();

  allComments = signal<Comment[]>([]);

  currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  @HostListener('window:profilePhotoUpdated', ['$event'])
  updateUserPhoto(event: Event): void {
    const customEvent = event as CustomEvent;

    this.currentUser = customEvent.detail;
  }

  content = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.getComments();
  }

  getComments(): void {
    this.commentService.getAllComments(this.postId(), 1, 10).subscribe({
      next: (res) => {
        const firstPageComments = res.data.comments;
        const numberOfPages = res.meta.pagination.numberOfPages;

        if (numberOfPages <= 1) {
          this.allComments.set(firstPageComments);
          return;
        }

        let requests = [];

        for (let page = 2; page <= numberOfPages; page++) {
          requests.push(this.commentService.getAllComments(this.postId(), page, 10));
        }

        import('rxjs').then(({ forkJoin }) => {
          forkJoin(requests).subscribe({
            next: (responses) => {
              const allComments = [
                ...firstPageComments,
                ...responses.flatMap((response) => response.data.comments),
              ];

              this.allComments.set(allComments);
            },
            error: (err) => console.log(err),
          });
        });
      },
      error: (err) => console.log(err),
    });
  }

  addComment(): void {
    if (this.content.invalid) {
      this.content.markAsTouched();
      return;
    }

    this.commentService.createComment(this.postId(), this.content.value!).subscribe({
      next: (res) => {
        console.log(res);

        this.content.reset('');

        this.getComments();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(this.postId(), commentId).subscribe({
      next: (res) => {
        this.allComments.update((comments) =>
          comments.filter((comment) => comment._id !== commentId),
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editingCommentId = signal<string | null>(null);

  editContent = new FormControl('', [Validators.required]);

  startEdit(comment: any): void {
    this.editingCommentId.set(comment._id);
    this.editContent.setValue(comment.content);
  }

  updateComment(commentId: string): void {
    if (this.editContent.invalid) {
      this.editContent.markAsTouched();
      return;
    }

    this.commentService.updateComment(this.postId(), commentId, this.editContent.value!).subscribe({
      next: (res) => {
        this.editingCommentId.set(null);
        this.editContent.reset('');

        this.getComments();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

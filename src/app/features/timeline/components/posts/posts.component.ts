import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from './posts.service';
import { Post } from './models/post.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsComponent } from './components/comments/comments.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommentsComponent],
  selector: 'app-posts',
  styleUrl: './posts.component.css',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  allPosts = signal<Post[]>([]);
  selectedPost = signal<Post | null>(null);
  currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  idUser = signal(JSON.parse(localStorage.getItem('user')!)._id);

  File = signal<File | null>(null);
  imgSrc = signal('');

  content = new FormControl('');
  Privacy = new FormControl('public');

  editingPostId = signal<string | null>(null);

  editPostContent = new FormControl('', Validators.required);
  editPrivacy = new FormControl('public');

  editFile = signal<File | null>(null);
  editImgSrc = signal('');

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.allPosts.set(res.data.posts);
      },
      error: (err) => console.log(err),
    });
  }

  changeFile(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.File.set(input.files[0]);
      this.imgSrc.set(URL.createObjectURL(input.files[0]));
    }
  }

  changeEditFile(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.editFile.set(input.files[0]);
      this.editImgSrc.set(URL.createObjectURL(input.files[0]));
    }
  }

  submitForm(e: SubmitEvent): void {
    e.preventDefault();

    const formData = new FormData();

    if (this.content.value) {
      formData.append('body', this.content.value);
    }

    formData.append('privacy', this.Privacy.value ?? 'public');

    if (this.File()) {
      formData.append('image', this.File()!);
    }

    this.postsService.createPost(formData).subscribe({
      next: () => {
        this.getData();
        this.content.reset('');
        this.Privacy.reset('public');
        this.File.set(null);
        this.imgSrc.set('');
      },
      error: (err) => console.log(err),
    });
  }

  startEdit(post: Post): void {
    this.editingPostId.set(post._id);

    this.editPostContent.setValue(post.body);
    this.editPrivacy.setValue(post.privacy);

    this.editFile.set(null);
    this.editImgSrc.set(post.image || '');
  }

  cancelEdit(): void {
    this.editingPostId.set(null);
    this.editPostContent.reset('');
    this.editPrivacy.reset('public');

    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  updatePost(postId: string): void {
    if (this.editPostContent.invalid) {
      this.editPostContent.markAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('body', this.editPostContent.value ?? '');
    formData.append('privacy', this.editPrivacy.value ?? 'public');

    if (this.editFile()) {
      formData.append('image', this.editFile()!);
    }

    this.postsService.updatePost(postId, formData).subscribe({
      next: () => {
        this.cancelEdit();
        this.getData();
      },
      error: (err) => console.log(err),
    });
  }

  deletePost(id: string): void {
    this.postsService.deletePost(id).subscribe({
      next: () => {
        this.getData();
      },
      error: (err) => console.log(err),
    });
  }
  showPostDetails(post: Post): void {
    this.selectedPost.set(post);
  }

  closePostDetails(): void {
    this.selectedPost.set(null);
  }
  sharePost(postId: string): void {
    this.postsService.sharePost(postId).subscribe({
      next: (res) => {
        console.log('Post shared successfully', res);
        this.getData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleLike(postId: string): void {
    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        console.log('Like updated successfully', res);
        this.getData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

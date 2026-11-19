import { User } from './user.interface';
import { Bookmark, Post } from './postuser.interface';

export interface Pagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: Pagination;
  };
}

export interface MyProfileData {
  user: User;
}

export interface UserPostsData {
  posts: Post[];
}

export interface BookmarksData {
  bookmarks: Bookmark[];
}

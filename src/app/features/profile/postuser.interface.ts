export interface PostUser {
  _id?: string;
  name?: string;
  username?: string;
  photo?: string;
}

export interface Post {
  _id: string;
  body: string;
  image?: string;
  privacy?: string;

  user?: PostUser;

  likes?: unknown[];
  likesCount?: number;

  sharesCount?: number;

  comments?: unknown[];
  commentsCount?: number;

  createdAt?: string;
}

export interface Bookmark {
  _id: string;
  body: string;
  image?: string;
  privacy?: string;
  user?: PostUser;
  likes?: unknown[];
  likesCount?: number;
  sharesCount?: number;
  comments?: unknown[];
  commentsCount?: number;
  createdAt?: string;
}

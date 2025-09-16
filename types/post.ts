export type PostStatus = 'success' | 'failure';

export interface Post {
  id: string;
  userId: string;
  nickname: string;
  iconUrl: string;
  status: PostStatus;
  title: string;
  comment: string;
  timestamp: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: string[]; // いいねしたユーザーIDの配列
}

export interface CreatePostData {
  status: PostStatus;
  title: string;
  comment: string;
}

export interface UpdatePostData {
  status?: PostStatus;
  title?: string;
  comment?: string;
}




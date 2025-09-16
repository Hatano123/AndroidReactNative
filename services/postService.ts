import { app } from '@/constants/firebaseConfig';
import { CreatePostData, Post, UpdatePostData } from '@/types/post';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';

const db = getFirestore(app);

export class PostService {
  private static readonly COLLECTION_NAME = 'posts';

  // 投稿を作成
  static async createPost(postData: CreatePostData): Promise<string> {
    try {
      const userId = 'guest';
      const userProfile = await this.getUserProfile(userId);
      
      const post: Omit<Post, 'id'> = {
        userId,
        nickname: userProfile.nickname || 'ゲスト',
        iconUrl: userProfile.iconUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
        status: postData.status,
        title: postData.title,
        comment: postData.comment,
        timestamp: new Date().toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        likedBy: [],
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...post,
        createdAt: Timestamp.fromDate(post.createdAt),
        updatedAt: Timestamp.fromDate(post.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      throw error;
    }
  }

  // 投稿一覧を取得
  static async getPosts(limitCount: number = 50): Promise<Post[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          userId: data.userId,
          nickname: data.nickname,
          iconUrl: data.iconUrl,
          status: data.status,
          title: data.title,
          comment: data.comment,
          timestamp: data.timestamp,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
        });
      });

      return posts;
    } catch (error) {
      console.error('投稿の取得に失敗しました:', error);
      throw error;
    }
  }

  // ユーザーの投稿を取得
  static async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          userId: data.userId,
          nickname: data.nickname,
          iconUrl: data.iconUrl,
          status: data.status,
          title: data.title,
          comment: data.comment,
          timestamp: data.timestamp,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
        });
      });

      return posts;
    } catch (error) {
      console.error('ユーザー投稿の取得に失敗しました:', error);
      throw error;
    }
  }

  // 投稿を更新
  static async updatePost(postId: string, updateData: UpdatePostData): Promise<void> {
    try {
      const postRef = doc(db, this.COLLECTION_NAME, postId);
      await updateDoc(postRef, {
        ...updateData,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('投稿の更新に失敗しました:', error);
      throw error;
    }
  }

  // 投稿を削除
  static async deletePost(postId: string): Promise<void> {
    try {
      const postRef = doc(db, this.COLLECTION_NAME, postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('投稿の削除に失敗しました:', error);
      throw error;
    }
  }

  // いいね機能
  static async toggleLike(postId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    try {
      const postRef = doc(db, this.COLLECTION_NAME, postId);
      const post = await this.getPostById(postId);
      
      if (!post) {
        throw new Error(`投稿が見つかりません (ID: ${postId})`);
      }
      
      const isLiked = post.likedBy.includes(userId);
      
      if (isLiked) {
        // いいねを解除
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likes: post.likes - 1,
        });
        return { likes: post.likes - 1, liked: false };
      } else {
        // いいねを追加
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
          likes: post.likes + 1,
        });
        return { likes: post.likes + 1, liked: true };
      }
    } catch (error) {
      console.error('いいねの切り替えに失敗しました:', error);
      throw error;
    }
  }

  // 投稿をIDで取得
  private static async getPostById(postId: string): Promise<Post | null> {
    try {
      const postRef = doc(db, this.COLLECTION_NAME, postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        return null;
      }

      const data = postSnap.data();
      
      return {
        id: postSnap.id,
        userId: data.userId,
        nickname: data.nickname,
        iconUrl: data.iconUrl,
        status: data.status,
        title: data.title,
        comment: data.comment,
        timestamp: data.timestamp,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        likes: data.likes || 0,
        likedBy: data.likedBy || [],
      };
    } catch (error) {
      console.error('投稿の取得に失敗しました:', error);
      return null;
    }
  }

  // ユーザープロフィールを取得
  private static async getUserProfile(userId: string): Promise<{ nickname: string; iconUrl: string }> {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileSnap = await getDocs(query(collection(db, 'profiles'), where('__name__', '==', userId)));
      
      if (profileSnap.empty) {
        return {
          nickname: 'ゲスト',
          iconUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        };
      }

      const data = profileSnap.docs[0].data();
      return {
        nickname: data.nickname || 'ゲスト',
        iconUrl: data.iconUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
      };
    } catch (error) {
      console.error('プロフィールの取得に失敗しました:', error);
      return {
        nickname: 'ゲスト',
        iconUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      };
    }
  }
}

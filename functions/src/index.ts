import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

export const createPost = functions.https.onCall(async (data: any, context: any) => {
  // 認証なしでもゲストとして投稿
  const userId = context.auth?.uid || 'guest';
  const { status, comment } = data;

  // 入力データの検証
  if (typeof status !== 'string' || !['success', 'failure'].includes(status)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The "status" field must be either "success" or "failure".'
    );
  }
  if (typeof comment !== 'string' || comment.length > 500) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The "comment" field must be a string no longer than 500 characters.'
    );
  }

  try {
    // 2. 投稿者情報の取得（存在しない場合はデフォルト）
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : undefined;
    const authorNickname = userData?.nickname || 'Guest';
    const authorIconUrl = userData?.iconUrl || 'https://example.com/default_icon.png';
    const authorTitle = userData?.title || 'Beginner';

    // 3. ドキュメントの作成
    const newPostRef = db.collection('posts').doc();
    await newPostRef.set({
      userId: userId,
      authorNickname: authorNickname,
      authorIconUrl: authorIconUrl,
      authorTitle: authorTitle,
      status: status,
      comment: comment,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      likesCount: 0,
    });

    return { postId: newPostRef.id, message: 'Post created successfully!' };
  } catch (error: any) {
    if (error.code === 'unauthenticated' || error.code === 'invalid-argument' || error.code === 'not-found') {
      throw error;
    }
    console.error('Error creating post:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create post.',
      error.message
    );
  }
});

export const getPublicTimeline = functions.https.onCall(async (data: any, context: any) => {
  try {
    const postsSnapshot = await db.collection('posts')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { posts: posts };
  } catch (error: any) {
    console.error('Error fetching public timeline:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch public timeline.',
      error.message
    );
  }
});

export const getFriendTimeline = functions.https.onCall(async (data: any, context: any) => {
  // 1. ユーザー認証の確認
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const userId = context.auth.uid;

  try {
    // 2. フレンドリストの取得
    const friendsSnapshot = await db.collection('users').doc(userId).collection('friends').get();
    const friendIds = friendsSnapshot.docs.map(doc => doc.id);

    if (friendIds.length === 0) {
      return { posts: [] }; // No friends, no friend posts
    }

    // 3. 投稿の取得
    const postsSnapshot = await db.collection('posts')
      .where('userId', 'in', friendIds)
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { posts: posts };
  } catch (error: any) {
    console.error('Error fetching friend timeline:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch friend timeline.',
      error.message
    );
  }
});

export const likePost = functions.https.onCall(async (data: any, context: any) => {
  // 1. ユーザー認証の確認
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const userId = context.auth.uid;
  const { postId } = data;

  // 入力データの検証
  if (typeof postId !== 'string' || postId.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The "postId" field must be a non-empty string.'
    );
  }

  try {
    await db.runTransaction(async (transaction) => {
      const postRef = db.collection('posts').doc(postId);
      const likeRef = postRef.collection('likes').doc(userId);

      const [postDoc, likeDoc] = await transaction.getAll(postRef, likeRef);

      if (!postDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Post not found.');
      }

      // 3. 重複チェック (既に「いいね」済みか)
      if (likeDoc.exists) {
        // If already liked, unlike it (toggle functionality)
        transaction.update(postRef, {
          likesCount: admin.firestore.FieldValue.increment(-1)
        });
        transaction.delete(likeRef);
        return { message: 'Post unliked successfully!' };
      } else {
        // 4. いいねの実行
        transaction.update(postRef, {
          likesCount: admin.firestore.FieldValue.increment(1)
        });
        transaction.set(likeRef, {
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        return { message: 'Post liked successfully!' };
      }
    });

    return { message: 'Like operation completed successfully!' };
  } catch (error: any) {
    if (error.code === 'unauthenticated' || error.code === 'invalid-argument' || error.code === 'not-found') {
      throw error;
    }
    console.error('Error liking post:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to like post.',
      error.message
    );
  }
});
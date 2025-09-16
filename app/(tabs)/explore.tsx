import PostInputModal from '@/components/PostInputModal';
import PostItem, { PostItemProps } from '@/components/PostItem';
import { Colors } from '@/constants/theme';
import { PostService } from '@/services/postService';
import { Post } from '@/types/post';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

function PublicTimeline({ posts, onRefresh, refreshing, onLike, onEdit, onDelete }: {
  posts: Post[];
  onRefresh: () => void;
  refreshing: boolean;
  onLike: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}) {
  const convertToPostItemProps = (post: Post): PostItemProps => ({
    id: post.id,
    status: post.status,
    iconUrl: post.iconUrl,
    nickname: post.nickname,
    title: post.title,
    comment: post.comment,
    timestamp: post.timestamp,
    likes: post.likes,
    onLike: () => onLike(post.id),
    onEdit: (id: string) => onEdit(id),
    onDelete: (id: string) => onDelete(id),
    isOwner: post.userId === 'guest', // 実際の実装では認証されたユーザーIDと比較
  });

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem {...convertToPostItemProps(item)} />}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

function FriendsTimeline({ posts, onRefresh, refreshing, onLike, onEdit, onDelete }: {
  posts: Post[];
  onRefresh: () => void;
  refreshing: boolean;
  onLike: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}) {
  const convertToPostItemProps = (post: Post): PostItemProps => ({
    id: post.id,
    status: post.status,
    iconUrl: post.iconUrl,
    nickname: post.nickname,
    title: post.title,
    comment: post.comment,
    timestamp: post.timestamp,
    likes: post.likes,
    onLike: () => onLike(post.id),
    onEdit: (id: string) => onEdit(id),
    onDelete: (id: string) => onDelete(id),
    isOwner: post.userId === 'guest', // 実際の実装では認証されたユーザーIDと比較
  });

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem {...convertToPostItemProps(item)} />}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

export default function TimelineScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 投稿を読み込み
  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await PostService.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
      Alert.alert('エラー', '投稿の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    loadPosts();
  }, []);

  // リフレッシュ
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // 投稿作成
  const handleSubmit = async (status: 'success' | 'failure', comment: string) => {
    try {
      const title = status === 'success' ? '鋼の意志' : '挑戦者';
      await PostService.createPost({
        status,
        title,
        comment,
      });
      
      // 投稿一覧を更新
      await loadPosts();
      setModalVisible(false);
      Alert.alert('成功', '投稿が作成されました！');
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      Alert.alert('エラー', '投稿の作成に失敗しました');
    }
  };

  // いいね機能
  const handleLike = async (postId: string) => {
    try {
      const userId = 'guest'; // 実際の実装では認証されたユーザーIDを使用
      const result = await PostService.toggleLike(postId, userId);
      
      // ローカル状態を更新
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: result.likes }
            : post
        )
      );
    } catch (error) {
      console.error('いいねの切り替えに失敗しました:', error);
      Alert.alert('エラー', 'いいねの切り替えに失敗しました');
    }
  };

  // 投稿編集
  const handleEdit = (postId: string) => {
    // 編集機能は後で実装
    Alert.alert('編集', '編集機能は準備中です');
  };

  // 投稿削除
  const handleDelete = async (postId: string) => {
    Alert.alert(
      '投稿を削除',
      'この投稿を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await PostService.deletePost(postId);
              await loadPosts(); // 投稿一覧を更新
              Alert.alert('成功', '投稿が削除されました');
            } catch (error) {
              console.error('投稿の削除に失敗しました:', error);
              Alert.alert('エラー', '投稿の削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>タイムライン</Text>
      <View style={styles.tabArea}>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: Colors.primaryGreen },
            tabBarLabelStyle: { fontWeight: 'bold' },
            tabBarStyle: { backgroundColor: Colors.lightGreenBackground },
          }}
        >
          <Tab.Screen 
            name="Public" 
            options={{ tabBarLabel: '公開' }}
          >
            {() => (
              <PublicTimeline
                posts={posts}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Tab.Screen>
          <Tab.Screen 
            name="Friends" 
            options={{ tabBarLabel: 'フレンド' }}
          >
            {() => (
              <FriendsTimeline
                posts={posts}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => setModalVisible(true)}
      />
      <PostInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreenBackground,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginTop: 32,
    marginLeft: 20,
    marginBottom: 8,
    fontFamily: 'Nunito', // フォントは後で導入
  },
  tabArea: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 28,
    elevation: 4,
  },
});
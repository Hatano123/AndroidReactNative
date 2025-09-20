import LoginButton from '@/components/LoginButton';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// モックデータ
const mockPosts = [
  {
    id: '1',
    nickname: 'Taro',
    title: '鋼の意志',
    status: 'success',
    comment: '今日も一日頑張った！',
    icon: 'https://randomuser.me/api/portraits/men/1.jpg',
    timestamp: '2024-01-15 14:30',
  },
  {
    id: '2',
    nickname: 'Jiro',
    title: '3日の旅人',
    status: 'failure',
    comment: '明日からまた切り替える。',
    icon: 'https://randomuser.me/api/portraits/men/2.jpg',
    timestamp: '2024-01-15 12:15',
  },
  {
    id: '3',
    nickname: 'Saburo',
    title: '初心',
    status: 'success',
    comment: '良いスタートが切れた。',
    icon: 'https://randomuser.me/api/portraits/men/3.jpg',
    timestamp: '2024-01-15 10:45',
  },
  {
    id: '4',
    nickname: 'Yuki',
    title: '不屈の精神',
    status: 'success',
    comment: '一週間継続できた！',
    icon: 'https://randomuser.me/api/portraits/women/1.jpg',
    timestamp: '2024-01-14 16:20',
  },
  {
    id: '5',
    nickname: 'Ken',
    title: '新参者',
    status: 'failure',
    comment: 'また明日から頑張る。',
    icon: 'https://randomuser.me/api/portraits/men/4.jpg',
    timestamp: '2024-01-14 09:30',
  },
];

interface PostItemProps {
  item: {
    id: string;
    nickname: string;
    title: string;
    status: 'success' | 'failure';
    comment: string;
    icon: string;
    timestamp: string;
  };
}

const PostItem: React.FC<PostItemProps> = ({ item }) => (
  <View style={styles.postItem}>
    <View style={[
      styles.statusIndicator,
      { backgroundColor: item.status === 'success' ? '#4CAF50' : '#F44336' }
    ]} />
    <View style={styles.postContent}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.icon }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  </View>
);

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<'public' | 'friends'>('public');
  const [isPostModalVisible, setPostModalVisible] = useState(false);
  const [postStatus, setPostStatus] = useState<'success' | 'failure'>('success');
  const [postComment, setPostComment] = useState('');

  const handlePostSubmit = () => {
    if (!postComment.trim()) {
      Alert.alert('エラー', 'コメントを入力してください');
      return;
    }
    
    Alert.alert('投稿完了', '投稿が完了しました');
    setPostModalVisible(false);
    setPostComment('');
  };

  const renderPosts = () => {
    // 実際の実装では、activeTabに応じて異なるデータを表示
    return (
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>タイムライン</Text>
        <LoginButton style={styles.loginButton} />
      </View>

      {/* タブナビゲーション */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'public' && styles.activeTab]}
          onPress={() => setActiveTab('public')}
        >
          <Text style={[styles.tabText, activeTab === 'public' && styles.activeTabText]}>
            公開
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            フレンド
          </Text>
        </TouchableOpacity>
      </View>

      {/* 投稿一覧 */}
      <View style={styles.content}>
        {renderPosts()}
      </View>

      {/* 投稿ボタン */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setPostModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 投稿モーダル */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPostModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新しい投稿</Text>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>ステータス:</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    postStatus === 'success' && styles.statusButtonActive
                  ]}
                  onPress={() => setPostStatus('success')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    postStatus === 'success' && styles.statusButtonTextActive
                  ]}>
                    成功
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    postStatus === 'failure' && styles.statusButtonActive
                  ]}
                  onPress={() => setPostStatus('failure')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    postStatus === 'failure' && styles.statusButtonTextActive
                  ]}>
                    失敗
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="コメントを入力してください..."
              value={postComment}
              onChangeText={setPostComment}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPostModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handlePostSubmit}
              >
                <Text style={styles.submitButtonText}>投稿</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreenBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
  },
  loginButton: {
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.primaryGreen,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postsList: {
    paddingBottom: 80,
  },
  postItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textColor,
  },
  title: {
    fontSize: 14,
    color: Colors.subtleTextColor,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.subtleTextColor,
  },
  comment: {
    fontSize: 15,
    color: Colors.textColor,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textColor,
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: Colors.primaryGreen,
    borderColor: Colors.primaryGreen,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statusButtonTextActive: {
    color: 'white',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryGreen,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

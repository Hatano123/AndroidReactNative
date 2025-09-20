import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoginButtonProps {
  style?: any;
  showProviderOptions?: boolean;
}

export default function LoginButton({ style, showProviderOptions = false }: LoginButtonProps) {
  const { user, loading, signInWithGoogle, signInWithGitHub, logout, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setShowModal(false);
      await signInWithGoogle();
      Alert.alert('ログイン', 'Googleでログインしました');
    } catch (error) {
      console.error('Google認証エラー:', error);
      Alert.alert('エラー', 'Google認証に失敗しました。もう一度お試しください。');
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setShowModal(false);
      await signInWithGitHub();
      Alert.alert('ログイン', 'GitHubでログインしました');
    } catch (error) {
      console.error('GitHub認証エラー:', error);
      Alert.alert('エラー', 'GitHub認証に失敗しました。もう一度お試しください。');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('ログアウト', 'ログアウトしました');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      Alert.alert('エラー', 'ログアウトに失敗しました。');
    }
  };

  const handlePress = () => {
    if (isAuthenticated) {
      handleLogout();
    } else if (showProviderOptions) {
      setShowModal(true);
    } else {
      handleGoogleLogin();
    }
  };

  if (loading) {
    return (
      <TouchableOpacity style={[styles.button, style]} disabled>
        <ActivityIndicator color="white" size="small" />
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
        <Text style={styles.buttonText}>
          {isAuthenticated ? 'ログアウト' : 'ログイン'}
        </Text>
      </TouchableOpacity>

      {/* 認証プロバイダー選択モーダル */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ログイン方法を選択</Text>
            
            <TouchableOpacity style={styles.providerButton} onPress={handleGoogleLogin}>
              <Text style={styles.providerButtonText}>Googleでログイン</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.providerButton} onPress={handleGitHubLogin}>
              <Text style={styles.providerButtonText}>GitHubでログイン</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  providerButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  providerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LoginButtonProps {
  style?: any;
}

export default function LoginButton({ style }: LoginButtonProps) {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  const handlePress = async () => {
    try {
      if (user) {
        await logout();
        Alert.alert('ログアウト', 'ログアウトしました');
      } else {
        await signInWithGoogle();
        Alert.alert('ログイン', 'ログインしました');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      Alert.alert('エラー', '認証に失敗しました。もう一度お試しください。');
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
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.buttonText}>
        {user ? 'ログアウト' : 'ログイン'}
      </Text>
    </TouchableOpacity>
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
});

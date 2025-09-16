import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LoginButtonProps {
  style?: any;
}

export default function LoginButton({ style }: LoginButtonProps) {
  const { user, loading, signIn, logout } = useAuth();

  const handlePress = async () => {
    try {
      if (user) {
        await logout();
      } else {
        await signIn();
      }
    } catch (error) {
      console.error('認証エラー:', error);
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




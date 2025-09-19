import { auth } from '@/constants/firebaseConfig';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// WebBrowserの認証セッションを完了させる
WebBrowser.maybeCompleteAuthSession();

// Google Cloud Consoleから取得したクライアントID
const WEB_CLIENT_ID = '1092742276840-reuknt3s7fe9783s3kbe1u6ca1hd7gsv.apps.googleusercontent.com'; // Web Client ID
const ANDROID_CLIENT_ID = '1092742276840-vmk0lipbd7ofhsacdgt22e7gflvn970n.apps.googleusercontent.com';

const CLIENT_ID = Platform.OS === 'android' ? ANDROID_CLIENT_ID : WEB_CLIENT_ID; // Use this only if the hook doesn't accept platform specific IDs

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID, // Use web client ID here, the hook should handle the rest
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri: 'https://auth.expo.io/@chibicha/ExpoKIN',
    responseType: ResponseType.IdToken,
  });

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
    if (!auth) {
      console.error('Firebase auth is not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 認証レスポンスの処理
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential).catch((error) => {
          console.error('Firebase認証エラー:', error);
        });
      }
    }
  }, [response]);

  const signInWithGoogle = async () => {
    try {
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }

      setLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Googleログインエラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

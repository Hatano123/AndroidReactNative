import { auth } from '@/constants/firebaseConfig';
import { AUTH_PROVIDERS, exchangeCodeForToken, fetchUserInfo, getRedirectUri, removeToken, saveToken } from '@/services/authService';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

// WebBrowserの認証セッションを完了させる
WebBrowser.maybeCompleteAuthSession();

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Google認証の設定
  const [googleRequest, googleResponse, googlePromptAsync] = useAuthRequest(
    {
      clientId: AUTH_PROVIDERS.GOOGLE.clientId,
      scopes: AUTH_PROVIDERS.GOOGLE.scopes,
      redirectUri: getRedirectUri(),
      responseType: ResponseType.IdToken,
    },
    AUTH_PROVIDERS.GOOGLE.discovery
  );

  // GitHub認証の設定
  const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(
    {
      clientId: AUTH_PROVIDERS.GITHUB.clientId,
      scopes: AUTH_PROVIDERS.GITHUB.scopes,
      redirectUri: getRedirectUri(),
      responseType: ResponseType.Code,
    },
    AUTH_PROVIDERS.GITHUB.discovery
  );

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
    if (!auth) {
      console.error('Firebase auth is not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Google認証レスポンスの処理
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential).catch((error) => {
          console.error('Firebase認証エラー:', error);
        });
      }
    } else if (googleResponse?.type === 'error') {
      console.error('Google認証エラー:', googleResponse.error);
    }
  }, [googleResponse]);

  // GitHub認証レスポンスの処理
  useEffect(() => {
    if (githubResponse?.type === 'success') {
      const { code } = githubResponse.params;
      if (code) {
        handleGitHubAuth(code);
      }
    } else if (githubResponse?.type === 'error') {
      console.error('GitHub認証エラー:', githubResponse.error);
    }
  }, [githubResponse]);

  // GitHub認証の処理
  const handleGitHubAuth = async (code: string) => {
    try {
      setLoading(true);
      // バックエンドサーバーに認可コードを送信してアクセストークンを取得
      const accessToken = await exchangeCodeForToken('github', code);
      
      // トークンを保存
      await saveToken('github', accessToken);
      
      // ユーザー情報を取得
      const userInfo = await fetchUserInfo('github', accessToken);
      
      // Firebaseにユーザー情報を保存（必要に応じて）
      console.log('GitHub認証成功:', userInfo);
      
    } catch (error) {
      console.error('GitHub認証処理エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!googleRequest) {
        throw new Error('Google認証リクエストが準備できていません');
      }

      setLoading(true);
      await googlePromptAsync();
    } catch (error) {
      console.error('Googleログインエラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    try {
      if (!githubRequest) {
        throw new Error('GitHub認証リクエストが準備できていません');
      }

      setLoading(true);
      await githubPromptAsync();
    } catch (error) {
      console.error('GitHubログインエラー:', error);
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
      
      // Firebaseからログアウト
      await signOut(auth);
      
      // 保存されたトークンを削除
      await removeToken('google');
      await removeToken('github');
      
      setIsAuthenticated(false);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithGitHub,
      logout, 
      isAuthenticated 
    }}>
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

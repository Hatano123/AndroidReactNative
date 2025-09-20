import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri } from 'expo-auth-session';

// 認証プロバイダーの設定
export const AUTH_PROVIDERS = {
  GOOGLE: {
    name: 'Google',
    clientId: '1092742276840-vmk0lipbd7ofhsacdgt22e7gflvn970n.apps.googleusercontent.com',
    discovery: {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    },
    scopes: ['openid', 'profile', 'email'],
  },
  GITHUB: {
    name: 'GitHub',
    clientId: 'YOUR_GITHUB_CLIENT_ID', // GitHubで取得したClient ID
    discovery: {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
      revocationEndpoint: 'https://github.com/settings/connections/applications/YOUR_GITHUB_CLIENT_ID',
    },
    scopes: ['user:email'],
  },
} as const;

// リダイレクトURIを生成
export const getRedirectUri = () => {
  return makeRedirectUri({
    scheme: 'com.hata.expokin',
    path: 'auth',
  });
};

// トークンの保存
export const saveToken = async (provider: string, token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${provider}_access_token`, token);
  } catch (error) {
    console.error('トークンの保存に失敗しました:', error);
    throw error;
  }
};

// トークンの取得
export const getToken = async (provider: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(`${provider}_access_token`);
  } catch (error) {
    console.error('トークンの取得に失敗しました:', error);
    return null;
  }
};

// トークンの削除
export const removeToken = async (provider: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${provider}_access_token`);
  } catch (error) {
    console.error('トークンの削除に失敗しました:', error);
    throw error;
  }
};

// 認証状態の確認
export const isAuthenticated = async (provider: string): Promise<boolean> => {
  const token = await getToken(provider);
  return token !== null;
};

// バックエンドサーバーに認可コードを送信（実装例）
export const exchangeCodeForToken = async (
  provider: string,
  code: string
): Promise<string> => {
  try {
    // 実際の実装では、ここでバックエンドサーバーにAPIリクエストを送信
    // 例: POST /api/auth/exchange-code
    const response = await fetch('YOUR_BACKEND_URL/api/auth/exchange-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        code,
        redirectUri: getRedirectUri(),
      }),
    });

    if (!response.ok) {
      throw new Error('サーバーエラーが発生しました');
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('認可コードの交換に失敗しました:', error);
    throw error;
  }
};

// ユーザー情報の取得（実装例）
export const fetchUserInfo = async (provider: string, token: string) => {
  try {
    let apiUrl = '';
    
    switch (provider) {
      case 'google':
        apiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        break;
      case 'github':
        apiUrl = 'https://api.github.com/user';
        break;
      default:
        throw new Error('サポートされていないプロバイダーです');
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    throw error;
  }
};

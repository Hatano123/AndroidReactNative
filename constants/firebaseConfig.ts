// Firebase初期化用
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCiQEl32n27QLLof8l5Wzj1cD-qsudYw-M',
  authDomain: 'androidappkin.firebaseapp.com',
  projectId: 'androidappkin',
  storageBucket: 'androidappkin.firebasestorage.app',
  messagingSenderId: '653787721618',
  appId: '1:653787721618:android:bf30a0331b17d22714db4b',
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);




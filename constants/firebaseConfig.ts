// Firebase初期化用
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCiQEl32n27QLLof8l5Wzj1cD-qsudYw-M',
  authDomain: '', // Android用は空でOK
  projectId: 'androidappkin',
  storageBucket: 'androidappkin.firebasestorage.app',
  messagingSenderId: '653787721618',
  appId: '1:653787721618:android:bf30a0331b17d22714db4b',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EditProfileModal from '@/components/EditProfileModal';
import LoginButton from '@/components/LoginButton';
import SocialConnections from '@/components/SocialConnections';
import { db } from '@/constants/firebaseConfig';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';


export default function IndexScreen() {
  const { user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userNickname, setUserNickname] = useState('Alex');
  const [userIconUri, setUserIconUri] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = user?.uid || 'guest';
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserNickname(userData.nickname || 'No Nickname');
        setUserIconUri(userData.iconUri || 'https://randomuser.me/api/portraits/men/1.jpg');
        setCurrentStreak(userData.streak || 0);
        setLongestStreak(userData.longestStreak || 0);
        setTotalDays(userData.totalDays || 0);
      } else {
        const defaultUserData = {
          nickname: 'Guest',
          iconUri: 'https://randomuser.me/api/portraits/men/1.jpg',
          title: 'Beginner',
          streak: 0,
          longestStreak: 0,
          totalDays: 0,
          friends: [],
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, defaultUserData, { merge: true });
        setUserNickname(defaultUserData.nickname);
        setUserIconUri(defaultUserData.iconUri);
        setCurrentStreak(defaultUserData.streak);
        setLongestStreak(defaultUserData.longestStreak);
        setTotalDays(defaultUserData.totalDays);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async (newNickname: string, newIconUri: string) => {
    let finalIconUri = newIconUri;
    const userId = 'guest';

    try {
      if (newIconUri.startsWith('file://')) {
        const response = await fetch(newIconUri);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${userId}/${Date.now()}.jpg`);
        const uploadTask = await uploadBytes(storageRef, blob);
        finalIconUri = await getDownloadURL(uploadTask.ref);
      }

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        nickname: newNickname,
        iconUri: finalIconUri,
      });

      const postsCollectionRef = collection(db, 'posts');
      const userPostsQuery = query(postsCollectionRef, where('userId', '==', userId));
      const userPostsSnapshot = await getDocs(userPostsQuery);

      const batch = writeBatch(db);
      userPostsSnapshot.docs.forEach((postDoc) => {
        batch.update(postDoc.ref, {
          authorNickname: newNickname,
          authorIconUrl: finalIconUri,
        });
      });
      await batch.commit();

      setUserNickname(newNickname);
      setUserIconUri(finalIconUri);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>マイページ</Text>
          <View style={styles.headerButtons}>
            <LoginButton style={styles.loginButton} />
            <TouchableOpacity style={styles.editProfileBtnHeader} onPress={() => setModalVisible(true)}>
              <Text style={styles.editProfileText}>プロフィール編集</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileBlock}>
            <Image
              source={{ uri: userIconUri }}
              style={styles.profileIcon}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{userNickname}</Text>
              <Text style={styles.title}>3-Day Traveler</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Current Streak</Text>
            <Text style={styles.statsValue}>{currentStreak}</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Longest Streak</Text>
            <Text style={styles.statsValue}>{longestStreak}</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Total Days</Text>
            <Text style={styles.statsValue}>{totalDays}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ marginBottom: 16 }}>
        <SocialConnections />
      </View>

      <EditProfileModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        currentNickname={userNickname}
        currentIconUri={userIconUri}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButton: {
    minWidth: 70,
    paddingHorizontal: 12,
  },
  editProfileBtnHeader: {
    backgroundColor: '#555',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  editProfileBtn: {
    backgroundColor: '#555',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 12,
    alignSelf: 'center',
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  sectionSpacing: {
    height: 24,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightGreenBackground,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginBottom: 24,
    textAlign: 'left',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: Colors.borderColor,
    },
  profileInfo: {
    marginLeft: 8,
    flex: 1,
    justifyContent: 'center',
    },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 4,
    },
  editIcon: {
    fontSize: 18,
    color: Colors.primaryGreen,
  },
  title: {
    fontSize: 16,
    color: Colors.subtleTextColor,
    fontWeight: '600',
    },
  memberSince: {
    fontSize: 13,
    color: Colors.subtleTextColor,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.subtleTextColor,
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
  },
});
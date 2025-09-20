import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../context/ProfileContext';

export default function MyPageScreen() {
  const navigation = useNavigation();
  const { nickname, icon } = useProfile();

  return (
    <View style={styles.container}>
      <Image source={{ uri: icon }} style={styles.profileIcon} />
      <Text style={styles.nickname}>{nickname}</Text>
      <Button
        title="プロフィール変更"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});


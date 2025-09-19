import { Colors } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileCardProps {
  nickname: string;
  iconUri: string;
  onNicknameChange: (newNickname: string) => void;
  onIconUriChange: (newIconUri: string) => void;
}

export default function ProfileCard({ nickname, iconUri, onNicknameChange, onIconUriChange }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: iconUri }}
        style={styles.avatar}
      />
      <View style={styles.infoArea}>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.title}>3-Day Traveler</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => {}}>
        <Text style={styles.editButtonText}>編集</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderColor,
  },
  infoArea: {
    marginLeft: 16,
    flex: 1,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: Colors.subtleTextColor,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: Colors.primaryGreen,
    padding: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

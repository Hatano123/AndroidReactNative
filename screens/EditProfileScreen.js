import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../context/ProfileContext';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { nickname: currentNickname, icon: currentIcon, updateProfile } = useProfile();
  const [nickname, setNickname] = useState(currentNickname);
  const [icon, setIcon] = useState(currentIcon);

  const handleSave = () => {
    updateProfile(nickname, icon);
    navigation.goBack(); // 保存後、前の画面に戻る
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>プロフィール編集</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ニックネーム:</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="ニックネームを入力"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>アイコンURL:</Text>
        <TextInput
          style={styles.input}
          value={icon}
          onChangeText={setIcon}
          placeholder="アイコンのURLを入力"
        />
      </View>

      <Button title="保存" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});
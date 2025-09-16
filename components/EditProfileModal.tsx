import { Colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentNickname: string;
  currentIconUri: string;
  onSave: (newNickname: string, newIconUri: string) => void;
}

export default function EditProfileModal({
  isVisible,
  onClose,
  currentNickname,
  currentIconUri,
  onSave,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [iconUri, setIconUri] = useState(currentIconUri);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIconUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    onSave(nickname, iconUri);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>プロフィール編集</Text>

          <TouchableOpacity onPress={pickImage} style={styles.iconContainer}>
            <Image
              source={{ uri: iconUri || 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.profileIcon}
            />
            <Text style={styles.changeIconText}>アイコンを変更</Text>
          </TouchableOpacity>

          <Text style={styles.label}>ニックネーム</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNickname}
            value={nickname}
            placeholder="ニックネームを入力"
          />


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primaryGreen,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.borderColor,
    marginBottom: 10,
  },
  changeIconText: {
    color: Colors.primaryGreen,
    fontSize: 16,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.textColor,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    color: Colors.textColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: Colors.primaryGreen,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
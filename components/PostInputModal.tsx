import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (status: 'success' | 'failure', text: string) => void;
}

export default function PostInputModal({ visible, onClose, onSubmit }: Props) {
  const [status, setStatus] = useState<'success' | 'failure'>('success');
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onSubmit(status, text);
    setText('');
    setStatus('success');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>投稿</Text>
          <View style={styles.selectRow}>
            <TouchableOpacity
              style={[styles.selectBtn, status === 'success' && styles.selected]}
              onPress={() => setStatus('success')}
            >
              <Text style={[styles.selectText, status === 'success' && styles.selectedText]}>成功</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectBtn, status === 'failure' && styles.selectedFailure]}
              onPress={() => setStatus('failure')}
            >
              <Text style={[styles.selectText, status === 'failure' && styles.selectedFailureText]}>失敗</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="コメントを入力..."
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>投稿</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  selectedFailure: {
    backgroundColor: '#e74c3c',
  },
  selectedFailureText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  closeText: {
    fontSize: 28,
    color: Colors.subtleTextColor,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginBottom: 16,
    textAlign: 'center',
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  selectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: Colors.borderColor,
    marginHorizontal: 8,
  },
  selected: {
    backgroundColor: Colors.primaryGreen,
  },
  selectText: {
    fontSize: 16,
    color: Colors.subtleTextColor,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: Colors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

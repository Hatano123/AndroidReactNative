import { Colors } from '@/constants/theme';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type RecordActivityModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (startTime: string, duration: string) => void;
};

export default function RecordActivityModal({ visible, onClose, onSave }: RecordActivityModalProps) {
  // 開始時刻ピッカーstate
  const [startHour, setStartHour] = useState('10');
  const [startMinute, setStartMinute] = useState('30');
  const [duration, setDuration] = useState('');

  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutesArr = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
  onSave(`${startHour}:${startMinute}`, duration);
  onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>記録を追加</Text>
          {/* 開始時刻セクション */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>開始時刻</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={startHour}
                style={styles.picker}
                onValueChange={setStartHour}
              >
                {hours.map((h) => (
                  <Picker.Item label={`${h} 時`} value={h} key={h} />
                ))}
              </Picker>
              <Picker
                selectedValue={startMinute}
                style={styles.picker}
                onValueChange={setStartMinute}
              >
                {minutesArr.map((m: string) => (
                  <Picker.Item label={`${m} 分`} value={m} key={m} />
                ))}
              </Picker>
            </View>
          </View>
          {/* 実施時間セクション */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>何分行ったか</Text>
            <View style={styles.durationContainer}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
                placeholder="例: 30"
              />
              <Text style={styles.unitText}>分</Text>
            </View>
          </View>
          {/* ボタンセクション */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Record</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pickerColumn: {
    width: 80,
    height: 120,
  },
  pickerItem: {
    fontSize: 18,
    color: '#333',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primaryGreen,
  },
  inputSection: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 150,
    overflow: 'hidden',
  },
  picker: {
    width: '45%',
    height: 150,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  unitText: {
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: Colors.primaryGreen,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: 'gray',
    fontSize: 16,
  },
});

import LoginButton from '@/components/LoginButton';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

// モックデータ
const mockRecords = {
  '2024-01-15': { minutes: 15, note: '朝の記録' },
  '2024-01-14': { minutes: 20, note: '夜の記録' },
  '2024-01-12': { minutes: 10, note: '短時間' },
  '2024-01-10': { minutes: 25, note: '長時間' },
};

const markedDates = {
  '2024-01-15': { marked: true, dotColor: '#4CAF50' },
  '2024-01-14': { marked: true, dotColor: '#4CAF50' },
  '2024-01-12': { marked: true, dotColor: '#F44336' },
  '2024-01-10': { marked: true, dotColor: '#4CAF50' },
};

export default function RecordScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [recordMinutes, setRecordMinutes] = useState('');
  const [recordNote, setRecordNote] = useState('');

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
    
    // 既存の記録がある場合は設定
    if (mockRecords[day.dateString as keyof typeof mockRecords]) {
      const existingRecord = mockRecords[day.dateString as keyof typeof mockRecords];
      setRecordMinutes(existingRecord.minutes.toString());
      setRecordNote(existingRecord.note);
    } else {
      setRecordMinutes('');
      setRecordNote('');
    }
  };

  const handleSaveRecord = () => {
    if (!recordMinutes.trim()) {
      Alert.alert('エラー', '時間を入力してください');
      return;
    }

    const minutes = parseInt(recordMinutes);
    if (isNaN(minutes) || minutes < 0) {
      Alert.alert('エラー', '有効な時間を入力してください');
      return;
    }

    Alert.alert('保存完了', `${selectedDate}の記録を保存しました`);
    setModalVisible(false);
    setRecordMinutes('');
    setRecordNote('');
  };

  const getWeeklyStats = () => {
    // 実際の実装では、選択された週のデータを計算
    return {
      totalCount: 3,
      totalMinutes: 45,
      averageMinutes: 15,
      goalAchievement: 80,
    };
  };

  const getMonthlyStats = () => {
    // 実際の実装では、選択された月のデータを計算
    return {
      totalCount: 8,
      totalMinutes: 120,
      averageMinutes: 15,
      goalAchievement: 75,
    };
  };

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>記録</Text>
        <LoginButton style={styles.loginButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* カレンダー */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'white',
              calendarBackground: 'white',
              textSectionTitleColor: Colors.primaryGreen,
              selectedDayBackgroundColor: Colors.primaryGreen,
              selectedDayTextColor: 'white',
              todayTextColor: Colors.primaryGreen,
              dayTextColor: Colors.textColor,
              textDisabledColor: '#d9e1e8',
              dotColor: Colors.primaryGreen,
              selectedDotColor: 'white',
              arrowColor: Colors.primaryGreen,
              monthTextColor: Colors.textColor,
              indicatorColor: Colors.primaryGreen,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
            }}
          />
        </View>

        {/* 週間統計 */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>今週の統計</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.totalCount}</Text>
              <Text style={styles.statLabel}>合計回数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.totalMinutes}分</Text>
              <Text style={styles.statLabel}>合計時間</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.averageMinutes}分</Text>
              <Text style={styles.statLabel}>平均時間</Text>
            </View>
          </View>
          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>目標達成率</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${weeklyStats.goalAchievement}%` }
                ]} 
              />
            </View>
            <Text style={styles.goalPercentage}>{weeklyStats.goalAchievement}%</Text>
          </View>
        </View>

        {/* 月間統計 */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>今月の統計</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.totalCount}</Text>
              <Text style={styles.statLabel}>合計回数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.totalMinutes}分</Text>
              <Text style={styles.statLabel}>合計時間</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.averageMinutes}分</Text>
              <Text style={styles.statLabel}>平均時間</Text>
            </View>
          </View>
          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>目標達成率</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${monthlyStats.goalAchievement}%` }
                ]} 
              />
            </View>
            <Text style={styles.goalPercentage}>{monthlyStats.goalAchievement}%</Text>
          </View>
        </View>

        {/* 目標設定 */}
        <View style={styles.goalsContainer}>
          <Text style={styles.goalsTitle}>目標設定</Text>
          <View style={styles.goalItem}>
            <Text style={styles.goalItemLabel}>週間目標回数</Text>
            <Text style={styles.goalItemValue}>2回以下</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalItemLabel}>平均時間目標</Text>
            <Text style={styles.goalItemValue}>10分未満</Text>
          </View>
          <TouchableOpacity style={styles.editGoalsButton}>
            <Text style={styles.editGoalsButtonText}>目標を編集</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 記録入力モーダル */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDate} の記録
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>時間（分）</Text>
              <TextInput
                style={styles.timeInput}
                value={recordMinutes}
                onChangeText={setRecordMinutes}
                placeholder="例: 15"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>メモ（任意）</Text>
              <TextInput
                style={styles.noteInput}
                value={recordNote}
                onChangeText={setRecordNote}
                placeholder="メモを入力してください..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveRecord}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreenBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
  },
  loginButton: {
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.subtleTextColor,
  },
  goalContainer: {
    marginTop: 8,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textColor,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryGreen,
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryGreen,
    textAlign: 'center',
  },
  goalsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalItemLabel: {
    fontSize: 16,
    color: Colors.textColor,
  },
  goalItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryGreen,
  },
  editGoalsButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 8,
    alignItems: 'center',
  },
  editGoalsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textColor,
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryGreen,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

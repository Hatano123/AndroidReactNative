
import ProfileCard from '@/components/ProfileCard';
import RecordActivityModal from '@/components/RecordActivityModal';
import { CardStyle, Colors } from '@/constants/theme';
import { ActivityService } from '@/services/activityService';
import { Activity, ActivitySummary } from '@/types/activity';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import { app } from '../../constants/firebaseConfig';
type DateObject = { dateString: string; day: number; month: number; year: number; timestamp: number; };

export default function ActivityRecordsScreen() {
  const db = getFirestore(app);
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState('Alex');
  const [iconUri, setIconUri] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [activities, setActivities] = useState<{ [key: string]: ActivitySummary }>({}); // State to store fetched activities
  const [selectedDateActivities, setSelectedDateActivities] = useState<Activity[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loadProfileAndActivities = async () => {
      // ゲストとして読み書き
      const userId = 'guest';

      // Load profile
      const profileDocRef = doc(db, 'profiles', userId);
      const profileDocSnap = await getDoc(profileDocRef);

      if (profileDocSnap.exists()) {
        const data = profileDocSnap.data();
        setNickname(data.nickname || 'Alex');
        setIconUri(data.iconUri || 'https://randomuser.me/api/portraits/men/1.jpg');
      } else {
        console.log('プロフィールが存在しません。デフォルト値を使用します。');
        // デフォルトプロフィールを作成
        await setDoc(profileDocRef, {
          nickname: 'Alex',
          iconUri: 'https://randomuser.me/api/portraits/men/1.jpg',
        });
      }

      // Load activities for current month
      await loadMonthActivities();
    };

    loadProfileAndActivities();
  }, [db, modalVisible, currentMonth]); // Re-run when modalVisible or currentMonth changes

  // 月間の活動記録を読み込み
  const loadMonthActivities = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const monthActivities = await ActivityService.getActivitiesByMonth(year, month);
      
      const activitiesMap: { [key: string]: ActivitySummary } = {};
      monthActivities.forEach(activity => {
        activitiesMap[activity.date] = activity;
      });
      
      setActivities(activitiesMap);
    } catch (error) {
      console.error('月間活動記録の読み込みに失敗しました:', error);
      // エラーが発生した場合は空のマップを設定
      setActivities({});
    }
  };

  const handleNicknameChange = async (newNickname: string) => {
    setNickname(newNickname);
    const userId = 'guest';
    await setDoc(doc(db, 'profiles', userId), {
      nickname: newNickname,
      iconUri: iconUri,
    });
  };

  const handleIconUriChange = async (newIconUri: string) => {
    setIconUri(newIconUri);
    const userId = 'guest';
    await setDoc(doc(db, 'profiles', userId), {
      nickname: nickname,
      iconUri: newIconUri,
    });
  };

  const handleSaveActivity = async (startTime: string, duration: string) => {
    if (!selected || !duration) {
      Alert.alert('エラー', '日付と時間を入力してください。');
      return;
    }

    try {
      await ActivityService.createActivity({
        date: selected,
        startTime: startTime,
        duration: parseInt(duration, 10),
      });
      
      Alert.alert('成功', '記録が保存されました！');
      setModalVisible(false);
      setSelected('');
      
      // 月間活動記録を再読み込み
      await loadMonthActivities();
    } catch (error) {
      console.error('活動記録の保存中にエラーが発生しました:', error);
      Alert.alert('エラー', '記録の保存に失敗しました。もう一度お試しください。');
    }
  };

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  const [weeklyActivityData, setWeeklyActivityData] = useState<{ day: string; minutes: number }[]>([]);

  useEffect(() => {
    const loadWeeklyActivities = async () => {
      try {
        const today = new Date();
        const startOfWeek = getStartOfWeek(new Date(today)); // Get Monday
        const startDateString = startOfWeek.toISOString().split('T')[0];
        
        const weekActivities = await ActivityService.getWeeklyActivities(startDateString);
        
        const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
        const newWeeklyActivityData = weekActivities.map((activity, index) => ({
          day: daysOfWeek[index],
          minutes: activity.totalMinutes,
        }));
        
        setWeeklyActivityData(newWeeklyActivityData);
      } catch (error) {
        console.error('週間活動記録の読み込みに失敗しました:', error);
        // エラーが発生した場合は空のデータを設定
        const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
        setWeeklyActivityData(daysOfWeek.map(day => ({ day, minutes: 0 })));
      }
    };

    loadWeeklyActivities();
  }, [activities]); // Recalculate when activities change

  // カレンダー用のマークされた日付データを作成
  const markedDates = Object.keys(activities).reduce((acc, date) => {
    const activity = activities[date];
    acc[date] = {
      marked: true,
      dotColor: Colors.primaryGreen,
      customStyles: {
        container: {
          backgroundColor: Colors.primaryGreen,
          borderRadius: 17.5,
          width: 35,
          height: 35,
          alignItems: 'center',
          justifyContent: 'center',
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {} as any);

  // 選択された日付を追加
  if (selected) {
    markedDates[selected] = {
      ...markedDates[selected],
      selected: true,
      selectedColor: Colors.primaryGreen,
    };
  }

  const maxMinutes = Math.max(...weeklyActivityData.map(data => data.minutes), 1); // Avoid division by zero

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>記録</Text>
      <Card style={[styles.card, CardStyle]}>
        <View>
          <Calendar
            markingType={'custom'}
            markedDates={markedDates}
            onDayPress={async (day: DateObject) => {
              setSelected(day.dateString);
              const selectedDate = activities[day.dateString];
              
              if (selectedDate && selectedDate.totalMinutes > 0) {
                // その日の活動記録を取得して表示
                try {
                  const dayActivities = await ActivityService.getActivitiesByDate(day.dateString);
                  setSelectedDateActivities(dayActivities);
                  
                  const totalMinutes = selectedDate.totalMinutes;
                  const activityCount = selectedDate.activityCount;
                  Alert.alert(
                    '記録情報',
                    `${day.dateString}の記録\n合計時間: ${totalMinutes}分\n記録数: ${activityCount}件`,
                    [
                      { text: '新しい記録を追加', onPress: () => setModalVisible(true) },
                      { text: '閉じる', style: 'cancel' }
                    ]
                  );
                } catch (error) {
                  console.error('日付の活動記録取得に失敗しました:', error);
                  setModalVisible(true);
                }
              } else {
                setModalVisible(true);
              }
            }}
            theme={{
              backgroundColor: Colors.cardBackground,
              calendarBackground: Colors.cardBackground,
              selectedDayBackgroundColor: Colors.primaryGreen,
              todayTextColor: Colors.primaryGreen,
              dayTextColor: Colors.textColor,
              textDisabledColor: Colors.subtleTextColor,
              arrowColor: Colors.primaryGreen,
              monthTextColor: Colors.primaryGreen,
            }}
          />
          {modalVisible && (
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => { setModalVisible(false); setSelected(''); }} />
          )}
        </View>
      </Card>
      <Card style={[styles.card, CardStyle]}>
        <Text style={styles.statsTitle}>今週の活動</Text>
        <View style={styles.barChartContainer}>
          {weeklyActivityData.map((data, index) => (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { height: `${(data.minutes / maxMinutes) * 100}%` as `${number}%` }, // Scale height based on max minutes
                ]}
              />
              <Text style={styles.barLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>合計時間</Text>
            <Text style={styles.statsValue}>{weeklyActivityData.reduce((sum, data) => sum + data.minutes, 0)}分</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>平均時間</Text>
            <Text style={styles.statsValue}>
              {(weeklyActivityData.reduce((sum, data) => sum + data.minutes, 0) / weeklyActivityData.length).toFixed(1)}分
            </Text>
          </View>
        </View>
      </Card>
      <RecordActivityModal
  visible={modalVisible}
  onClose={() => { setModalVisible(false); setSelected(''); }}
  onSave={handleSaveActivity}
      />
     <ProfileCard
       nickname={nickname}
       iconUri={iconUri}
       onNicknameChange={handleNicknameChange}
       onIconUriChange={handleIconUriChange}
     />
   </ScrollView>
 );
}

const markedDateStyle = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryGreen,
    borderRadius: 17.5,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreenBackground,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginTop: 32,
    marginLeft: 20,
    marginBottom: 8,
    fontFamily: 'Nunito',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 8,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150, // Fixed height for the chart area
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    paddingVertical: 10,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  bar: {
    width: '80%',
    backgroundColor: Colors.primaryGreen,
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.textColor,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statsItem: {
    alignItems: 'center',
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


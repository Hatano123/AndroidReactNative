import { app } from '@/constants/firebaseConfig';
import { Activity, ActivitySummary, CreateActivityData, UpdateActivityData } from '@/types/activity';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';

const db = getFirestore(app);

export class ActivityService {
  private static readonly COLLECTION_NAME = 'activities';

  // 活動記録を作成
  static async createActivity(activityData: CreateActivityData): Promise<string> {
    try {
      const userId = 'guest';
      
      const activity: Omit<Activity, 'id'> = {
        userId,
        date: activityData.date,
        startTime: activityData.startTime,
        duration: activityData.duration,
        timestamp: new Date(`${activityData.date}T${activityData.startTime}`).getTime(),
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: activityData.notes,
      };

      const docRef = await addDoc(collection(db, 'users', userId, this.COLLECTION_NAME), {
        ...activity,
        createdAt: Timestamp.fromDate(activity.createdAt),
        updatedAt: Timestamp.fromDate(activity.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('活動記録の作成に失敗しました:', error);
      throw error;
    }
  }

  // 特定の日の活動記録を取得
  static async getActivitiesByDate(date: string): Promise<Activity[]> {
    try {
      const userId = 'guest';
      const q = query(
        collection(db, 'users', userId, this.COLLECTION_NAME),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      const activities: Activity[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          userId: data.userId,
          date: data.date,
          startTime: data.startTime,
          duration: data.duration,
          timestamp: data.timestamp,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          notes: data.notes,
        });
      });

      // クライアント側でソート
      return activities.sort((a, b) => a.startTime.localeCompare(b.startTime));
    } catch (error) {
      console.error('活動記録の取得に失敗しました:', error);
      throw error;
    }
  }

  // 月間の活動記録を取得
  static async getActivitiesByMonth(year: number, month: number): Promise<ActivitySummary[]> {
    try {
      const userId = 'guest';
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
      
      const q = query(
        collection(db, 'users', userId, this.COLLECTION_NAME),
        where('date', '>=', startDate),
        where('date', '<', endDate)
      );
      
      const querySnapshot = await getDocs(q);
      const activitiesByDate: { [date: string]: Activity[] } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const activity: Activity = {
          id: doc.id,
          userId: data.userId,
          date: data.date,
          startTime: data.startTime,
          duration: data.duration,
          timestamp: data.timestamp,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          notes: data.notes,
        };

        if (!activitiesByDate[activity.date]) {
          activitiesByDate[activity.date] = [];
        }
        activitiesByDate[activity.date].push(activity);
      });

      // 各日の活動を開始時間でソート
      Object.keys(activitiesByDate).forEach(date => {
        activitiesByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });

      // 日付ごとにサマリーを作成
      const summaries: ActivitySummary[] = Object.keys(activitiesByDate)
        .sort()
        .map(date => ({
          date,
          totalMinutes: activitiesByDate[date].reduce((sum, activity) => sum + activity.duration, 0),
          activityCount: activitiesByDate[date].length,
          activities: activitiesByDate[date],
        }));

      return summaries;
    } catch (error) {
      console.error('月間活動記録の取得に失敗しました:', error);
      throw error;
    }
  }

  // 活動記録を更新
  static async updateActivity(activityId: string, updateData: UpdateActivityData): Promise<void> {
    try {
      const userId = 'guest';
      const activityRef = doc(db, 'users', userId, this.COLLECTION_NAME, activityId);
      await updateDoc(activityRef, {
        ...updateData,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('活動記録の更新に失敗しました:', error);
      throw error;
    }
  }

  // 活動記録を削除
  static async deleteActivity(activityId: string): Promise<void> {
    try {
      const userId = 'guest';
      const activityRef = doc(db, 'users', userId, this.COLLECTION_NAME, activityId);
      await deleteDoc(activityRef);
    } catch (error) {
      console.error('活動記録の削除に失敗しました:', error);
      throw error;
    }
  }

  // 週間の活動記録を取得
  static async getWeeklyActivities(startDate: string): Promise<ActivitySummary[]> {
    try {
      const userId = 'guest';
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      const endDateString = endDate.toISOString().split('T')[0];
      
      const q = query(
        collection(db, 'users', userId, this.COLLECTION_NAME),
        where('date', '>=', startDate),
        where('date', '<=', endDateString)
      );
      
      const querySnapshot = await getDocs(q);
      const activitiesByDate: { [date: string]: Activity[] } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const activity: Activity = {
          id: doc.id,
          userId: data.userId,
          date: data.date,
          startTime: data.startTime,
          duration: data.duration,
          timestamp: data.timestamp,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          notes: data.notes,
        };

        if (!activitiesByDate[activity.date]) {
          activitiesByDate[activity.date] = [];
        }
        activitiesByDate[activity.date].push(activity);
      });

      // 各日の活動を開始時間でソート
      Object.keys(activitiesByDate).forEach(date => {
        activitiesByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });

      // 週の各日に対してサマリーを作成（記録がない日は0分）
      const summaries: ActivitySummary[] = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        summaries.push({
          date: dateString,
          totalMinutes: activitiesByDate[dateString]?.reduce((sum, activity) => sum + activity.duration, 0) || 0,
          activityCount: activitiesByDate[dateString]?.length || 0,
          activities: activitiesByDate[dateString] || [],
        });
      }

      return summaries;
    } catch (error) {
      console.error('週間活動記録の取得に失敗しました:', error);
      throw error;
    }
  }
}

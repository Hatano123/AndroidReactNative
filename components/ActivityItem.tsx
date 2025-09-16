import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';

export type ActivityItemProps = {
  id: string;
  date: string;
  startTime: string;
  duration: number;
  onDelete: (id: string) => void;
  isOwner: boolean;
};

export default function ActivityItem({ id, date, startTime, duration, onDelete, isOwner }: ActivityItemProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.detailsText}>開始時刻: {startTime}</Text>
          <Text style={styles.detailsText}>実施時間: {duration} 分</Text>
        </View>
        {isOwner && (
          <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>削除</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 16,
    color: Colors.textColor,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
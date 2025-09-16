import { CardStyle, Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
  { key: 'friends', label: 'My Friends' },
  { key: 'requests', label: 'Requests' },
  { key: 'add', label: 'Add Friend' },
];

const friendsMock = [
  { id: '1', name: '旅人A', iconUrl: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: '挑戦者B', iconUrl: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: '応援C', iconUrl: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

export default function SocialConnections() {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <View style={[styles.card, CardStyle]}>
      <Text style={styles.heading}>Social Connections</Text>
      <Text style={styles.description}>フレンド機能で仲間と励まし合いましょう。</Text>
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'friends' && (
        <FlatList
          data={friendsMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendRow}>
              <Image source={{ uri: item.iconUrl }} style={styles.friendIcon} />
              <Text style={styles.friendName}>{item.name}</Text>
            </View>
          )}
          style={{ marginTop: 12 }}
        />
      )}
      {activeTab === 'requests' && (
        <Text style={{ marginTop: 16, color: Colors.subtleTextColor }}>申請はありません</Text>
      )}
      {activeTab === 'add' && (
        <Text style={{ marginTop: 16, color: Colors.subtleTextColor }}>フレンド追加機能は今後実装</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryGreen,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.subtleTextColor,
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  tabBtnActive: {
    backgroundColor: Colors.primaryGreen,
  },
  tabLabel: {
    color: Colors.subtleTextColor,
    fontWeight: 'bold',
  },
  tabLabelActive: {
    color: '#fff',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  friendIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: Colors.borderColor,
  },
  friendName: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: 'bold',
  },
});

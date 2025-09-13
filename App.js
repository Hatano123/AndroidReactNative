import * as React from 'react';
import { useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, SegmentedButtons, Card, Title, Paragraph, Button } from 'react-native-paper';

// モックデータ
const mockPosts = [
  { id: '1', type: 'public', status: 'success', title: '早起きチャレンジ', content: '今朝は5時に起きられました！', user: 'ユーザーA' },
  { id: '2', type: 'friend', status: 'failure', title: 'プログラミング学習', content: '今日は集中できませんでした...', user: 'フレンドB' },
  { id: '3', type: 'public', status: 'success', title: 'ウォーキング', content: '1時間歩きました！', user: 'ユーザーC' },
  { id: '4', type: 'friend', status: 'success', title: '読書', content: '新しい本を読み始めました。', user: 'フレンドD' },
];

// タイムライン画面コンポーネント
function TimelineScreen() {
  const [value, setValue] = useState('public');

  const filteredPosts = mockPosts.filter(post => {
    if (value === 'public') return post.type === 'public';
    if (value === 'friend') return post.type === 'friend';
    return true;
  });

  const renderItem = ({ item }) => (
    <Card style={[styles.card, { backgroundColor: item.status === 'success' ? '#e8f5e9' : '#ffebee' }]}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.content}</Paragraph>
        <Text style={styles.userName}>- {item.user}</Text>
      </Card.Content>
      <Card.Actions>
        <Button>詳細</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'public',
            label: '公開',
          },
          {
            value: 'friend',
            label: 'フレンド',
          },
        ]}
        style={styles.segmentedButtons}
      />
      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// 記録画面コンポーネント
function RecordScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>記録画面</Text>
    </View>
  );
}

// マイページ画面コンポーネント
function MyPageScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>マイページ画面</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4CAF50',
            tabBarStyle: { backgroundColor: '#fff' },
          }}
        >
          <Tab.Screen name="タイムライン" component={TimelineScreen} />
          <Tab.Screen name="記録" component={RecordScreen} />
          <Tab.Screen name="マイページ" component={MyPageScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  segmentedButtons: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 8,
    elevation: 2,
  },
  userName: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
});
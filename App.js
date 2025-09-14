import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

// 仮画面コンポーネント
function TimelineScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>タイムライン画面</Text>
    </View>
  );
}

function RecordScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>記録画面</Text>
    </View>
  );
}

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
import {Text, View} from 'react-native';

const HelloWorldApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Hello, world!</Text>
    </View>
  );
};
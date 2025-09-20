import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ProfileProvider } from './context/ProfileContext';

import MyPageScreen from './screens/MyPageScreen';
import EditProfileScreen from './screens/EditProfileScreen';

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

const MyPageStack = createNativeStackNavigator();

function MyPageStackScreen() {
  return (
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen name="MyPage" component={MyPageScreen} />
      <MyPageStack.Screen name="EditProfile" component={EditProfileScreen} />
    </MyPageStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ProfileProvider>
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
            <Tab.Screen name="マイページ" component={MyPageStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ProfileProvider>
  );
}
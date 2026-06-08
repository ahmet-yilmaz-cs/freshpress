import { Tabs } from 'expo-router';
import { Compass, Target, User, Zap } from 'lucide-react-native';

import { colors } from '@freshpress/design-system';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: 'rgba(249,249,249,0.95)',
          borderTopColor: colors.border,
          height: 88,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_700Bold',
          fontSize: 12,
          letterSpacing: 0.6,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: ({ color }) => <Compass size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Smart Juicer',
          tabBarIcon: ({ color }) => <Zap size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{ title: 'Goals', tabBarIcon: ({ color }) => <Target size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <User size={22} color={color} /> }}
      />
    </Tabs>
  );
}

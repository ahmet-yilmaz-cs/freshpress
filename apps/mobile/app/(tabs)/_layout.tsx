import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Compass, Droplet, Package, Target, User } from 'lucide-react-native';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@freshpress/design-system';

import { Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';
import { alpha } from '../../src/lib/visuals';

/** The center "Makine" tab is rendered as a raised orange circle (prototype/Figma). */
const CENTER_ROUTE = 'index';

/**
 * Custom tab bar matching the prototype: five tabs with the Smart Juicer button
 * raised in the middle; other tabs get an orange pill when active.
 */
function FreshTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 0 : 8);

  return (
    <View
      className="flex-row items-end border-t border-hairline bg-card px-1 pt-2"
      style={{ paddingBottom: bottom + 6 }}
    >
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        if (!descriptor) return null;
        const { options } = descriptor;
        const focused = state.index === index;
        const label = options.title ?? route.name;
        const isCenter = route.name === CENTER_ROUTE;
        const color = isCenter ? colors.white : focused ? colors.white : colors.muted;
        const icon = options.tabBarIcon?.({ focused, color, size: isCenter ? 24 : 20 });

        function onPress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        if (isCenter) {
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={onPress}
              className="-mt-8 flex-1 items-center"
            >
              <View
                className="h-14 w-14 items-center justify-center rounded-full bg-orange"
                style={{
                  shadowColor: colors.orange,
                  shadowOpacity: 0.45,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 6,
                  borderWidth: focused ? 3 : 0,
                  borderColor: alpha(colors.amber, 0.35),
                }}
              >
                {icon}
              </View>
              <Text className="mt-0.5 text-[10px] font-bold text-amber">{label}</Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            className="flex-1 items-center"
          >
            <View
              className={`items-center gap-0.5 rounded-full px-3 py-1.5 ${
                focused ? 'bg-orange' : ''
              }`}
            >
              {icon}
              <Text
                className={`text-[10px] ${focused ? 'font-bold text-white' : 'font-semibold text-muted'}`}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FreshTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: t.tabs.explore,
          tabBarIcon: ({ color }) => <Compass size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: t.tabs.stock,
          tabBarIcon: ({ color }) => <Package size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.juicer,
          tabBarIcon: ({ color, size }) => <Droplet size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: t.tabs.goals,
          tabBarIcon: ({ color }) => <Target size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}

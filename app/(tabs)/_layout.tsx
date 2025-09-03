import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleAddTask = () => {
    // Navigate to MyWork tab with action parameter to show modal
    router.push({
      pathname: '/(tabs)/myWork',
      params: { action: 'showAddTaskModal' }
    })
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="myWork"
          options={{
            title: 'My Work',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="suitcase.fill" color={color} />,
            headerShown: true,
            headerStyle: {borderWidth: 0, shadowColor: 'transparent'},
            headerRight: ({ tintColor }) => (
              <View style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
                <IconSymbol size={24} name="bell" color={'#161616'} />
                <IconSymbol size={24} name="arrow.uturn.backward.circle" color={'#161616'} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="spacer"
          options={{
            title: '',
            tabBarIcon: () => null,
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.line.uptrend.xyaxis" color={color} />,
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle" color={color} />,
            headerShown: true,
          }}
        />
      </Tabs>

      <TouchableOpacity style={styles.addTask} onPress={handleAddTask} activeOpacity={0.8}>
        <IconSymbol size={54} name="plus" color={'white'} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  addTask: {
    borderRadius: 50,
    backgroundColor: '#064148',
    height: 75,
    width: 75,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 45 : 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});

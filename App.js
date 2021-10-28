import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ListScreen from './components/ListScreen';
import ScanScreen from './components/ScanScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'md-home-outline'
            } else if (route.name === 'List') {
              iconName = 'md-search-outline'
            } else if (route.name === 'Scan') {
              iconName = 'md-scan-outline'
            } else if (route.name === 'Favs') {
              iconName = 'md-star-outline'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarShowLabel: false
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="List" component={ListScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Favs" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


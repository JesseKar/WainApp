import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ListScreen from './components/ListScreen';
import { Ionicons } from '@expo/vector-icons';
import { ItemViewer } from './components/ItemViewer';


const Tab = createBottomTabNavigator();
const ItemViewerStack = createStackNavigator();
const HomeStack = createStackNavigator();

function ItemViewerStackScreen() {
  return (
    <ItemViewerStack.Navigator screenOptions={{ headerShown: false }}>
      <ItemViewerStack.Screen name="ListScreen" component={ListScreen} />
      <ItemViewerStack.Screen name="ItemViewer" component={ItemViewer} />
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </ItemViewerStack.Navigator>
  )
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="ItemViewer" component={ItemViewer} />
    </HomeStack.Navigator>
  )
}

function FavoritesStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <HomeStack.Screen name="ItemViewer" component={ItemViewer} />
    </HomeStack.Navigator>
  )
}


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
            } else if (route.name === 'Item') {
              iconName = 'md-wine-outline'
            } else if (route.name === 'Favs') {
              iconName = 'md-star-outline'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarShowLabel: false,
          headerShown: false,
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="List" component={ItemViewerStackScreen} />
        <Tab.Screen name="Favs" component={FavoritesStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Screen Imports
import Home from './screens/Home/Home';
import SignUp from './screens/SignUp/SignUp';
import Category from './screens/CategoryItems/CategoryItems';
import Search from './screens/Search/Search';
import Item from './screens/Item/Item';
import LogIn from './screens/LogIn/LogIn';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Item" component={Item} />
      </Stack.Navigator>
      <Footer />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};
import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { AuthProvider, useAuth } from './AuthContext/AuthContext'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import Layout from './components/Layout';
// Screen Imports
import Home from './screens/Home/Home';
import SignUp from './screens/SignUp/SignUp';
import Category from './screens/CategoryItems/CategoryItems';
import Search from './screens/Search/Search';
import Item from './screens/Item/Item';
import LogIn from './screens/LogIn/LogIn';
import Info from './screens/SellScreens/Info';
import PhotoPage from './screens/SellScreens/Photo';
import Review from './screens/SellScreens/Review';
import Profile from './screens/Profile/Profile';
import Inbox from './screens/Inbox/Inbox';
import Message from './screens/Message/Message';
import UserSetting from './screens/UserSetting/UserSetting';
import LogIn2 from './screens/LogIn/LogIn2';
import SplashScreen from './screens/SplashScreen/SplashScreen';
// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';

// Function to load fonts
async function loadFonts() {
  try {
    await Font.loadAsync({
      'rigsans-bold': require('./assets/fonts/rigsans-bold.ttf'), 
      'basicsans-regular': require('./assets/fonts/basicsans-regular.ttf'),
      'basicsans-regularit': require('./assets/fonts/basicsans-regularit.ttf'),
    });
  } catch (error) {
    console.log('Error loading fonts:', error);
    throw new Error('Fonts could not be loaded');
  }
}


const getActiveRouteName = (state) => {
  const route = state.routes[state.index];
  if (route.state) {
    
    return getActiveRouteName(route.state);
  }
  return route.name;
};




const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { isSignedIn } = useAuth();
  const [splashComplete, setSplashComplete] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true)).catch(err => console.log('Error loading fonts:', err));
  }, []);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const state = navigationRef.current.getRootState(); 
      const currentRouteName = getActiveRouteName(state) || 'SplashScreen'; 
      setCurrentScreen(currentRouteName);
      console.log("Updated Current Screen to:", currentRouteName);
    });
    return unsubscribe;
  }, [navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      {fontsLoaded ? (
      <View style={styles.container}>
        {fontsLoaded && currentScreen !== 'SplashScreen' && <Header />}
        <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{ headerShown: false }}
            onStateChange={(state) => {
              console.log("Navigation State Changed:", state);
              const currentRouteName = state.routes[state.index].name;
              console.log("Current Route Name:", currentRouteName);
              setCurrentScreen(currentRouteName);
            }}
          >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Category" component={Category} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Item" component={Item} />
          <Stack.Screen name="Info" component={Info} />
          <Stack.Screen name="PhotoPage" component={PhotoPage} />
          <Stack.Screen name="Review" component={Review} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Inbox" component={Inbox} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="UserSetting" component={UserSetting} />
          <Stack.Screen name="LogIn2" component={LogIn2} />
        </Stack.Navigator>
        {fontsLoaded && currentScreen !== 'SplashScreen' && currentScreen !== 'SignUp' && <Footer />}
      </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2efe9',
  },
});

const AppWithAuthProvider = () => {

  
  return (
    <SafeAreaProvider>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default AppWithAuthProvider;
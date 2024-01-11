import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from './AuthContext/AuthContext'; // Import AuthProvider

// font imports


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
// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';

const Stack = createStackNavigator();

const App = () => {

  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Header />
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          {/* Define your screens here */}
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
        </Stack.Navigator>
        <Footer isSignedIn={isSignedIn}/>
      </View>
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
    <AuthProvider> 
      <App />
    </AuthProvider>
  );
};

export default AppWithAuthProvider;
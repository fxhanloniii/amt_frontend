import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import {useEffect, React} from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext/AuthContext';
import ShopIcon from '../assets/images/shopicon.png';
import SellIcon from '../assets/images/sellicon.png';
import ProfileIcon from '../assets/images/profileicon.png';
import InboxIcon from '../assets/images/inboxicon.png';

export default function Footer() {
  const { user, signOut, token, isSignedIn } = useAuth();
  const navigation = useNavigation();
  console.log('Is signed in:', isSignedIn);

  useEffect(() => {
    console.log('Auth state changed. isSignedIn:', isSignedIn);
  }, [isSignedIn]);

  return (
    <View style={styles.footerContainer}>
      {[
        { label: "Shop", icon: ShopIcon, route: "Home" },
        { label: "Sell", icon: SellIcon, route: "Info" },
        { label: "Inbox", icon: InboxIcon, route: "Inbox" },
        { label: "Profile", icon: ProfileIcon, route: isSignedIn ? "Profile" : "LogIn"},
      ].map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.buttonContainer}
          onPress={() => navigation.navigate(item.route)}
        >
          <View style={styles.circleButton}>
            <Image source={item.icon} style={styles.iconStyle}/>
          </View>
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
      },
      buttonContainer: {
        alignItems: 'center',
        
      },
      iconStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#384b56',
        resizeMode: 'contain',
      }    
})
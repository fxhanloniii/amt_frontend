import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function Footer({ isSignedIn }) {

  const navigation = useNavigation();
  console.log('Is signed in:', isSignedIn);

  return (
    <View style={styles.footerContainer}>
      {[
        { label: "Shop", icon: "S", route: "Home"},
        { label: "Sell", icon: "Se", route: "Info"},
        { label: "Inbox", icon: "I"},
        { label: isSignedIn ? "Profile" : "Log In", icon: "P", route: isSignedIn ? "Profile" : "LogIn"},
      ].map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.buttonContainer}
          onPress={() => navigation.navigate(item.route)}
        >
          <View style={styles.circleButton}>
            <Text>{item.icon}</Text>
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
      circleButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#384b56',
      }    
})
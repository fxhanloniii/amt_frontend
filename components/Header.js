import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native'
import React from 'react'

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text>Header</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20, 
        height: 50 + (Platform.OS === "android" ? StatusBar.currentHeight : 20), 
        backgroundColor: '#f4511e',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
      },
})
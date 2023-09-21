import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <Text>Footer</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    footerContainer: {
        height: 50, 
        backgroundColor: '#f4511e',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
      },    
})
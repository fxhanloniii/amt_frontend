import { StyleSheet, Text, View, Platform, StatusBar, Image } from 'react-native'
import React from 'react'

// Importing each letter
import R from '../assets/images/o.png'
import u from '../assets/images/p.png'
import b1 from '../assets/images/q.png'
import b2 from '../assets/images/q.png'
import l from '../assets/images/r.png'
import e from '../assets/images/s.png'

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Image source={R} style={styles.R} />
      <Image source={u} style={styles.u} />
      <Image source={b1} style={styles.b} />
      <Image source={b2} style={styles.b} />
      <Image source={l} style={styles.l} />
      <Image source={e} style={styles.e} />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    height: 50 + (Platform.OS === "android" ? StatusBar.currentHeight : 20),
    backgroundColor: '#f2efe9',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',  // Align letters to the bottom
    paddingLeft: 20, // Add some space to the left
    width: '100%',
  },
  R: {
    width: 16.26,
    height: 20.01,
    marginRight: 3,
    resizeMode: 'contain'
  },
  u: {
    width: 14.70,
    height: 16.63,
    marginRight: 3,
    resizeMode: 'contain'
  },
  b: {
    width: 16.78,
    height: 20.48,
    marginRight: 3,
    resizeMode: 'contain'
  },
  l: {
    width: 3.62,
    height: 20.01,
    marginRight: 3,
    resizeMode: 'stretch'
  },
  e: {
    width: 16.99,
    height: 17.00,
    resizeMode: 'contain'
  }
})
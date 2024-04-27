import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2efe9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20, // Adjust as needed
    paddingTop: 10, // Adjust as needed
  },
});

export default Layout;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SoldScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Thank you for your review!</Text>
      <Text style={styles.message}>Your item has been marked as SOLD.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2efe9',
  },
  message: {
    fontSize: 18,
    color: '#293e48',
    textAlign: 'center',
    fontFamily: 'basicsans-regular',
  },
});

export default SoldScreen;

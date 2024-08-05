import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ThankYou = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.thankYouText}>Thank you!</Text>
            <Text style={styles.instructionText}>Please sign in <Text style={styles.linkText} onPress={() => navigation.navigate('SplashScreen')}>HERE</Text></Text>
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
    thankYouText: {
        fontSize: 24,
        marginBottom: 20,
        fontFamily: 'basicsans-regular',
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'basicsans-regular',
    },
    linkText: {
        color: '#293e48',
        textDecorationLine: 'underline',
        fontFamily: 'basicsans-regular',
    },
});

export default ThankYou;

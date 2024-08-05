import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LogIn2() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const { setAuthToken, signIn, isSignedIn } = useAuth();

    const handleLogin = async () => {
        try {
            await signIn(email, password);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login failed: Login Page', error);
        }
        
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.input}
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <View style={styles.signUpView}>
                <Text style={styles.signUpText}>Not a member? </Text>
                <Text style={styles.signUpLink}>Sign up here</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 16,
        backgroundColor: '#9e3f19',
        // marginTop: 10,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        padding: 16,
        borderWidth: 0,
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 25,
        width: 350,
        fontFamily: 'basicsans-regularit',
    },
    button: {
        padding: 12, 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
        width: 150,
    },
    buttonText: {
        color: 'white', 
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'basicsans-regular',
    },
    signUpView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signUpText: {
        marginTop: 20,
        textAlign: 'center',
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'basicsans-regular',
    },
    signUpLink: {
        color: 'white',
        marginTop: 20,
        textDecorationLine: 'underline',
        fontSize: 16,
        fontFamily: 'basicsans-regular',
    },
});
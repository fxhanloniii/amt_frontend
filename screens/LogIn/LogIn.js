import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';


export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            <Button title="Log In" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
    },
    signUpText: {
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
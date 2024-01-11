import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { registerUser } from '../../api/auth';  // Importing the registerUser function from auth.js

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSignUp = async () => {
      if (password !== confirmPassword) {
        console.error("Passwords don't match!");
        return; // Stop execution here if passwords don't match
    }
        try {
            const response = await registerUser(username, email, password, confirmPassword, firstName, lastName);
            
            if (response) {
                // User registered successfully, navigate to the login page or home page
                navigation.navigate('LogIn');
            } else {
                // Handle errors during registration, display them to the user
            }
        } catch (error) {
            console.error("Error during sign up:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={text => setFirstName(text)}
                value={firstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={text => setLastName(text)}
                value={lastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                onChangeText={text => setPassword(text)}
                value={password}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={!isPasswordVisible}
                onChangeText={text => setConfirmPassword(text)}
                value={confirmPassword}
            />
            <TouchableOpacity 
                    style={styles.toggleIcon}
                    onPress={() => setPasswordVisibility(prevState => !prevState)}
                >
                    <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
            <Button title="Sign Up" onPress={handleSignUp} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f2efe9',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fcfbfa',
    },
});
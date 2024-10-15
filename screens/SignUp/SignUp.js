import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { registerUser, uploadProfileImage } from '../../api/auth';  // Importing the registerUser function from auth.js
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../AuthContext/AuthContext';

const BASE_URL = 'http://127.0.0.1:8000/';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setAuthToken, setUser } = useAuth();
    

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
        }
    };

    const uploadImage = async (uri) => {
        console.log('UploadImageFunction');
        const formData = new FormData();
        formData.append('image', {
            uri: uri,
            type: 'image/jpeg',
            name: 'profile-pic.jpg',
        });

        try {
            const response = await fetch(`${BASE_URL}/upload-profile-picture/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setProfileImage(data.image_url);
                console.log('Received image URL:', data.image_url);
                return data.image_url;
            } else {
                const errorData = await response.text(); // Get the error response as text
                console.error('Error uploading image:', errorData);
                Alert.alert('Error', 'Error uploading image. Please try again.');
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Error uploading image. Please try again.');
            return null;
        }
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', "Passwords don't match!");
            return;
        }

        setLoading(true);  // Start the loading indicator

        try {
            let profilePictureUrl = '';

            if (profileImage) {
                profilePictureUrl = await uploadImage(profileImage);
            }

            console.log('Registering user function:', {
                username,
                email,
                password,
                confirmPassword,
                zipCode,
                profilePictureUrl,
            });

            const response = await registerUser(
                username,
                email,
                password,
                confirmPassword,
                zipCode,
                profilePictureUrl
            );

            if (response.success) {
                console.log('User registered successfully:', response);
                navigation.navigate('SetRadius', { zipCode, token: response.token, userId: response.userId });
            } else {
                // Show detailed errors
                const errorMessages = Object.keys(response.errors)
                    .map(key => `${key}: ${response.errors[key].join(', ')}`)
                    .join('\n');
    
                Alert.alert('Registration Failed', errorMessages);
            }
        } catch (error) {
            console.error('Error during sign up:', error);
        } finally {
            setLoading(false);  // Stop the loading indicator
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#364a54" />
                    </View>
                )}
                <View style={styles.photoContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View>
                                <View style={styles.placeholderImage}></View>
                                <Text style={styles.addPhotoText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={text => setUsername(text)}
                    value={username}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={text => setPassword(text)}
                    value={password}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    onChangeText={text => setConfirmPassword(text)}
                    value={confirmPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={text => setEmail(text)}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Zipcode"
                    onChangeText={text => setZipCode(text)}
                    value={zipCode}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    <>
                        <View style={styles.buttonSymbol}>
                            <Text style={styles.symbolText}>{'>'}</Text>
                        </View>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: '#f2efe9',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 44,
        borderColor: 'darkgray',
        borderWidth: 0.5,
        borderRadius: 25,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fcfbfa',
        fontFamily: 'basicsans-regularit',
        paddingLeft: 20,
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    addPhotoText: {
        color: '#293e48',
        fontSize: 14,
        fontFamily: 'basicsans-regularit',
        textAlign: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 75,
        marginBottom: 20,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 75,
        marginBottom: 5,
        backgroundColor: '#293e48',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'row',
        padding: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 1,
        backgroundColor: '#293e48',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'basicsans-regular',
        flex: 1,
        textAlign: 'center',
        marginLeft: -10,
    },
    buttonSymbol: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    symbolText: {
        color: '#293e48',
        fontSize: 28,
        fontFamily: 'basicsans-regular',
        alignSelf: 'center',
        paddingTop: 0,
        lineHeight: 28,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});
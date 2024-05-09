import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { registerUser } from '../../api/auth';  // Importing the registerUser function from auth.js
import * as ImagePicker from 'expo-image-picker';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const pickImage = async () => {
        result = await ImagePicker.launchImageLibraryAsync({
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
        const formData = new FormData();
        formData.append('image', {
          uri: uri,
          type: 'image/jpeg', 
          name: 'profile-pic.jpg',
        });
      
        try {
          const response = await fetch(`${BASE_URL}/upload-image/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
      
          if (response.ok) {
            const data = await response.json();
            setProfileImage({ uri: data.image_url });
            updateUserProfileImage(data.image_url); 
            } else {
                Alert.alert('Error', 'Error uploading image. Please try again.');
                return null;
            }
        } catch (error) {
          Alert.alert('Error', 'Error uploading image. Please try again.');
          return null;
        }
      };
    

    const handleSignUp = async () => {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords don't match!");
        return; 
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
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View>
                            <View style={styles.placeholderImage}>
                                
                            </View>
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
                // secureTextEntry={!isPasswordVisible}
                onChangeText={text => setPassword(text)}
                value={password}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                // secureTextEntry={!isPasswordVisible}
                onChangeText={text => setConfirmPassword(text)}
                value={confirmPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput // Add the new TextInput for zipcode
                style={styles.input}
                placeholder="Zipcode"
                onChangeText={text => setZipCode(text)}
                value={zipCode}
                keyboardType="numeric" 
            />
            {/* <TouchableOpacity 
                    style={styles.toggleIcon}
                    onPress={() => setPasswordVisibility(prevState => !prevState)}
                >
                    <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <View style={styles.buttonSymbol}>
                <Text style={styles.symbolText}>{'>'}</Text>
            </View>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
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
});
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';

const UserSettings = ({ route, navigation }) => {
  const { user, signOut, token, isSignedIn } = useAuth();
  const userProfile = route.params?.userProfile;
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [city, setCity] = useState(userProfile?.city || '');
  

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('LogIn'); // Navigate to your login screen or any other appropriate screen
  };

  const handleUpdate = async () => {
    // Update logic here
    Alert.alert("Profile Updated", "Your profile has been updated successfully.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
      />
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="City"
      />
      {/* Additional fields here */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2efe9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fcfbfa',
  },
  button: {
    backgroundColor: '#293e48',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    
  },
});

export default UserSettings;
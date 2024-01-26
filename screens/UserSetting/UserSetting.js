import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 
const BASE_URL = 'http://13.57.40.111:8000';

const UserSettings = ({ route, navigation }) => {
  const { user, signOut, token, isSignedIn } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(route.params?.userProfile?.profilePictureUrl || 'default-profile-pic-url');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');

  
  useEffect(() => {
    fetchUserProfile();
  }, [user, token]);

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('LogIn'); 
  };

  // Function to pick a profile picture
  const pickProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
        uploadImage(result.uri);
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
        setProfilePicture({ uri: data.image_url });
        updateUserProfileImage(data.image_url); 
              }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const updateUserProfileImage = async (imageUrl) => {
    const updatedProfile = {
        ...userProfile, 
        profile_picture_url: imageUrl
    };
    await updateUserProfile(updatedProfile); 
    };

  const handleUpdate = async () => {
    const newProfileData = {
      bio: bio,
      city: city,
      state: state,
      profile_picture_url: profilePicture,
      first_name: firstName,
      last_name: lastName,
    };
  
    await updateUserProfile(newProfileData);
  };

  const updateUserProfile = async (newProfileData) => {
    try {
        console.log(user.pk)
      const response = await fetch(`${BASE_URL}/profiles/user/${user.pk}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfileData),
      });

      if (response.ok) {
                Alert.alert("Profile Updated", "Your profile has been updated successfully.");
        const updatedData = await response.json();
        setUserProfile(updatedData);
      } else {
        const errorData = await response.json();
        console.error('Failed to update user profile', errorData);
        Alert.alert("Update Failed", "There was a problem updating your profile.");
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
            const response = await fetch(`${BASE_URL}/profiles/user/${user.pk}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        if (data.profile_picture_url) {
            setProfilePicture({ uri: data.profile_picture_url });
            
        } else {
            setProfilePicture(noProfilePhoto);
        }
        setBio(data.bio || '');
        setCity(data.city || '');
        setState(data.state || '');
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity onPress={pickProfilePicture}>
        <Image source={profilePicture} style={styles.profileImage} key={profilePicture} />
      </TouchableOpacity>
        <Text style={styles.displayName}>{firstName} {lastName}</Text>
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
      <TextInput
      style={styles.input}
      value={state}
      onChangeText={setState}
      placeholder="State"
      />
      {/* Additional fields here */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2efe9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'gray',
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
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
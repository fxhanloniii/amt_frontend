import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png';
import TrashIcon from '../../assets/images/trashcan.png'; // Assuming you have a trash can icon
import Icon from 'react-native-vector-icons/FontAwesome';

const BASE_URL = 'http://localhost:8000';

const UserSettings = ({ route, navigation }) => {
  const { user, signOut, token, isSignedIn } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(route.params?.userProfile?.profilePictureUrl || noProfilePhoto);
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [zipCode, setZipCode] = useState(userProfile?.zip_code || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [user, token]);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/delete-account/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Account Deleted', 'Your account has been deleted.', [
          { text: 'OK', onPress: () => navigation.navigate('LogIn') },
        ]);
      } else {
        Alert.alert('Error', 'Failed to delete account. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again later.');
    }
  };

  const handleConfirmation = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteAccount(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('SplashScreen');
  };

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
      const response = await fetch(`${BASE_URL}/profiles/upload-profile-picture/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
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
      profile_picture_url: imageUrl,
    };
    await updateUserProfile(updatedProfile);
  };

  const handleUpdate = async () => {
    const newProfileData = {
      bio: bio,
      city: city,
      state: state,
      zip_code: zipCode,
      profile_picture_url: profilePicture,
      first_name: firstName,
      last_name: lastName,
    };

    console.log("Submitting Data: ", newProfileData);

    await updateUserProfile(newProfileData);
  };

  const updateUserProfile = async (newProfileData) => {
    try {
      const response = await fetch(`${BASE_URL}/profiles/user/${user.pk}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfileData),
      });

      // Parse the response JSON once and store it in a variable
      const responseData = await response.json();

      // Log the status and the parsed response data
      console.log("Response Status: ", response.status);
      console.log("Response Data: ", responseData);

      if (response.ok) {
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
        setUserProfile(responseData);
        
      } else {
        const errorData = await response.json();
        console.error('Failed to update user profile', errorData);
        Alert.alert('Update Failed', 'There was a problem updating your profile.');
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
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data);
        setUserProfile(data);
        if (data.profile_picture_url) {
          setProfilePicture({ uri: data.profile_picture_url });
        } else {
          setProfilePicture(noProfilePhoto);
        }
        setBio(data.bio || '');
        setCity(data.city || '');
        setState(data.state || '');
        setZipCode(data.zip_code || '');
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity onPress={pickProfilePicture}>
        <Image source={profilePicture} style={styles.profileImage} key={profilePicture} />
      </TouchableOpacity>
      <Text style={styles.displayName}>{firstName || user?.username} {lastName}</Text>

      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={setZipCode}
        placeholder="Zip Code"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <View style={styles.buttonSymbol}>
          <Text style={styles.symbolText}>{'>'}</Text>
        </View>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.buttonSymbol}>
            <Text style={styles.symbolText}>{'>'}</Text>
          </View>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleConfirmation} disabled={loading}>
          <View style={styles.buttonSymbol}>
            <Image source={TrashIcon} style={styles.trashIcon} />
          </View>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2efe9',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
  saveButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  logoutButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    marginBottom: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  deleteButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#364a54',
    marginTop: 10,
  },
  deleteButtonText: {
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
    lineHeight: 28,
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: '#293e48',
  },
  bottomButtonsContainer: {
    marginTop: 'auto',
  },
});

export default UserSettings;

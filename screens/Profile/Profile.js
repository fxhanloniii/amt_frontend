import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';

const Profile = () => {
    const { user, signOut } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);

    useEffect(() => {
        // fetch user profile on component mount
        console.log(user)
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            console.log('userid:', user.id)
            const response = await fetch(`http://127.0.0.1:8000/profiles/${user.id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userProfileData = await response.json();
                setUserProfile(userProfileData);

                // check if the fetched profile is for the current user

                setIsCurrentUserProfile(userProfileData.user === user.id);
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const updateUserProfile = async (newProfileData) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/profiles/${user.id}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${user.token}`,  
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProfileData),
          });
    
          if (response.ok) {
            console.log('User profile updated successfully');
            // Add pop up here
            fetchUserProfile();
          } else {
            console.error('Failed to update user profile');
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      };

    const userlistings = [];
    const userfavorites =[];

    const profileImage = user && user.profileImage;

    const renderListingItem = ({ item }) => (
        <View style={StyleSheet.listingItemContainer}>
            {/* Display your listing item content */}
            <Text>{item.title}</Text>
        </View>
    );

    const renderFavoriteItem = ({ item }) => (
        <View style={StyleSheet.favortiteItemContainer}>
            {/* Display your favorite items here */}
            <Text>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileImage }}  // Replace with users profile image
        />
        <View style={styles.userInfoContainer}>
          {/* <Text style={styles.userName}>{user.name}</Text> */}
          <Text style={styles.userUsername}>@{user?.username}</Text>
          {/* Add star rating component here */}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* My Listings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Listings</Text>
        {userlistings.length === 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate('FirstSellScreen')}>
            <View style={styles.emptyStateContainer}>
              <Text>Let's start selling!</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <FlatList
              data={userlistings}
              renderItem={renderListingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
            {userlistings.length > 6 && (
              <TouchableOpacity onPress={() =>  TODO }>
                <Text>View All Listings</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Favorites */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        {userfavorites.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text>Save your favorites</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={userFavorites}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
            {userFavorites.length > 6 && (
              <TouchableOpacity onPress={() => TODO }>
                <Text>View All Favorites</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 16,
      backgroundColor: 'gray',
    },
    userInfoContainer: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    userUsername: {
      fontSize: 16,
      color: 'gray',
    },
    divider: {
      height: 1,
      backgroundColor: 'gray',
      marginVertical: 16,
    },
    sectionContainer: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    emptyStateContainer: {
      width: '100%',
      height: 100,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    listingItemContainer: {
      marginRight: 16,
    },
    favoriteItemContainer: {
      marginRight: 16,
    },
  });
  
  export default Profile;
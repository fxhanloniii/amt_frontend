import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';

const Profile = ({ navigation }) => {
  const { user, signOut, token, isSignedIn } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [userlistings, setUserListings] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('User changed:', user);
    setUserListings([]);
    setUserFavorites([]);
    setLoading(true);

    if (user && token) {
      console.log('Fetching data for user:', user.pk);
      fetchUserItems();
      fetchUserProfile();
    } else {
      console.log('No user or token, skipping fetch');
      setLoading(false);
    }
  }, [user, token]);

  const navigateToSettings = () => {
    navigation.navigate('UserSetting', { userProfile });
  };

  const fetchUserItems = async () => {
    try {
      console.log('fetching user listings')
      setUserListings([]);
      console.log(user.pk)
      const response = await fetch(`http://127.0.0.1:8000/items/?seller=${user.pk}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userItemsData = await response.json();
        console.log(userItemsData)
        setUserListings(userItemsData);
        setLoading(false);
      } else {
        console.error('Failed to fetch user items');
      }
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      console.log('userid:', user.pk);
      const response = await fetch(`http://127.0.0.1:8000/profiles/${user.pk}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
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

  const handleLogout = async () => {
    await signOut();
    setUserProfile(null);
    setUserListings([]);
    setUserFavorites([]);
    navigation.navigate('LogIn'); // Navigate to your login screen or any other appropriate screen
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

  const handleSeeMore = (category) => {
    let endpoint;
  
    if (category === 'userlistings') {
      endpoint = `http://127.0.0.1:8000/items/?seller=${user.pk}`;
    } else if (category === 'userfavorites') {
      endpoint = `http://127.0.0.1:8000/favorites/?user=${user.pk}`;
    }
  
    // Navigate to the CategoryItems page with the appropriate endpoint
    navigation.navigate('Category', { categoryType: category, endpoint });
  };

  const renderSeeMoreButton = (category) => {
    // Show the "See More" button only if there are more than 6 items
    const showSeeMoreButton = category === 'userlistings' ? userlistings.length > 6 : userFavorites.length > 6;

    if (showSeeMoreButton) {
      return (
        <TouchableOpacity onPress={() => handleSeeMore(category)}>
          <View style={styles.seeMoreButton}>
            <Text>See More</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderListingItem = ({ item }) => {
    console.log('Listing item:', item );
    
    return (
      <TouchableOpacity key={item?.id} onPress={() => handleItemPress(item.id)}>
        <View style={styles.listingItemContainer}>
          <Image style={styles.itemImage}  /> 
          <Text>{item?.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFavoriteItem = ({ item }) => {
    console.log('Favorite item:', item);
    return (
        <View style={styles.favoriteItemContainer}>
        <TouchableOpacity key={item?.id} onPress={() => handleItemPress(item.id)}>
          <View style={styles.favoriteItemInnerContainer}>
            <Image style={styles.itemImage} source={{ uri: item?.image }} />
            <Text>{item?.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleItemPress = (itemId) => {
    console.log(itemId)
    navigation.navigate('Item', { itemId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <Image style={styles.profileImage} source={{ uri: null }} />
        <View style={styles.userInfoContainer}>
          <Text style={styles.userUsername}>@{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* My Listings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Listings</Text>
        {userlistings.length === 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate('Info')}>
            <View style={styles.emptyStateContainer}>
              <Text>Let's start selling!</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={userlistings.slice(0, 6)}  // Or remove slice(0, 6) to show all items
            renderItem={renderListingItem}
            keyExtractor={(item) => item?.id?.toString()}
            numColumns={3}
            key={'three-columns'}
          />
        )}
        {renderSeeMoreButton('userlistings')}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Favorites */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        {userFavorites.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text>Save your favorites</Text>
          </View>
        ) : (
          <View style={styles.itemList}>
            {userFavorites.slice(0, 6).map(renderFavoriteItem)}
          </View>
        )}
        {renderSeeMoreButton('userfavorites')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2efe9',
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
  itemList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'evenly',
  },
  listingItemContainer: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteItemContainer: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'grey',
  },
  seeMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});

export default Profile;
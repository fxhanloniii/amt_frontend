import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 
import settingsIcon from '../../assets/images/settingsicon.png';
const BASE_URL = 'http://3.101.60.200:8000';

const Profile = ({ navigation }) => {
  const { user, signOut, token, isSignedIn } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [userlistings, setUserListings] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(noProfilePhoto);

  useEffect(() => {
    setUserListings([]);
    setUserFavorites([]);
    setLoading(true);

    if (user && token) {
      fetchUserItems();
      fetchUserProfile();
      fetchUserFavorites();
    } else {
            setLoading(false);
    }
  }, [user, token]);

  const navigateToSettings = () => {
    navigation.navigate('UserSetting', { userProfile });
  };

  const fetchUserItems = async () => {
    try {
      setUserListings([]);
      const response = await fetch(`${BASE_URL}/items/?seller=${user.pk}`, {
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
            const response = await fetch(`${BASE_URL}/profiles/user/${user.pk}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userProfileData = await response.json();
        setUserProfile(userProfileData);

        if (userProfileData.profile_picture_url) {
          setProfilePicture({ uri: userProfileData.profile_picture_url });
                  } else {
          setProfilePicture(noProfilePhoto);
        }
        setIsCurrentUserProfile(userProfileData.user === user.id);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch(`${BASE_URL}/favorites/?user=${user.pk}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        
        const favoritesData = await response.json();
        
        console.log("favoritesData:", favoritesData); 
        if (Array.isArray(favoritesData)) {  // Check if the response is an array
          setUserFavorites(favoritesData);
        } else {
          console.error('Favorites data is not an array:', favoritesData);
        }
        setLoading(false);
      } else {
        console.error('Failed to fetch user favorites');
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  

  

  const handleSeeMore = (category) => {
    let endpoint;
  
    if (category === 'userlistings') {
      endpoint = `${BASE_URL}/items/?seller=${user.pk}`;
    } else if (category === 'userfavorites') {
      endpoint = `${BASE_URL}/favorites/?user=${user.pk}`;
    }
  
    navigation.navigate('Category', { categoryType: category, endpoint });
  };

  const renderSeeMoreButton = (category) => {
    // Show the "See More" button only if there are more than 6 items
    const showSeeMoreButton = category === 'userlistings' ? userlistings.length > 6 : userFavorites.length > 6;

    if (showSeeMoreButton) {
      return (
        <TouchableOpacity onPress={() => handleSeeMore(category)}>
          <View style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See More</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderListingItem = ({ item }) => {
    // Check if item is defined and item.images is an array with at least one image
    if (item && Array.isArray(item.images) && item.images.length > 0) {
      
      const imageUrl = item.images[0].image;
      
      const baseUrl = imageUrl.split('?')[0];
       
      

    
      const itemImage = { uri: baseUrl };
      return (
        <TouchableOpacity key={item.id} onPress={() => handleItemPress(item.id)}>
          <View style={styles.listingItemContainer}>
            <Image style={styles.itemImage} source={itemImage} />
          </View>
        </TouchableOpacity>
      );
    } else {
      // Handle the case where item is undefined or there are no images
      return (
        <TouchableOpacity key={item?.id} onPress={() => handleItemPress(item?.id)}>
          <View style={styles.listingItemContainer}>
            {/* You can show a placeholder image or text here */}
            <Text>No Image</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderFavoriteItem = ({ item }) => {
    if (item && Array.isArray(item.images) && item.images.length > 0) {
        return (
        <View>
        <TouchableOpacity key={item?.id} onPress={() => handleItemPress(item.id)}>
          <View style={styles.listingItemContainer}>
            <Image style={styles.itemImage} source={{ uri: item?.images[0].image }} />
          </View>
        </TouchableOpacity>
      </View>
    );
        } else {
          return (
            <TouchableOpacity key={item?.id} onPress={() => handleItemPress(item?.id)}>
              <View style={styles.favoriteItemContainer}>
                {/* You can show a placeholder image or text here */}
                <Text>No Image</Text>
              </View>
            </TouchableOpacity>
          );
        }
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
        <Image style={styles.profileImage} source={profilePicture} />
        <View style={styles.userInfoContainer}>
          <Text style={styles.firstName}>{user?.first_name} </Text>
          <Text style={styles.userUsername}>@{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
            <Image source={settingsIcon} style={styles.settingsButtonImage} />
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
              <Text style={styles.emptyText}>Let's start selling!</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.itemList}>
            {userlistings.slice(0, 6).map((item) => renderListingItem({ item }))}
          </View>
        )}
        {renderSeeMoreButton('userlistings')}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Favorites */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Favorites</Text>
        {userFavorites.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyText}>Save your favorites</Text>
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
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 16,
    backgroundColor: 'gray',
  },
  userInfoContainer: {
    flex: 1,
  },
  firstName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'RigSans-Bold',
  },
  userUsername: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'BasicSans-RegularIt'
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  sectionContainer: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'RigSans-Bold',
  },
  emptyStateContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#fcfbfa',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#293e49',
  },
  emptyText: {
    fontSize: 16,
    color: '#364a54',
  },
  itemList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'evenly',
  },
  listingItemContainer: {
    flex: 1,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteItemContainer: {
    flex: 1,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 110,
    height: 110,
    marginBottom: 2,
    backgroundColor: 'grey',
  },
  seeMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#293e48',
    marginVertical: 10,
    borderRadius: 50,
  },
  seeMoreText: {
    color: 'white',
    fontSize: 16,
  },
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10, 
  },
  settingsButtonImage: {
    width: 20, 
    height: 20, 
    resizeMode: 'contain',
  },
});

export default Profile;



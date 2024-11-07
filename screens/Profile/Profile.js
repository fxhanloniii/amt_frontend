import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 
import settingsIcon from '../../assets/images/settingsicon.png';
import selling from '../../assets/images/selling.png';
import savefavorites from '../../assets/images/savefavorites.png';
import pencil from '../../assets/images/pencil.png';
import Layout from '../../components/Layout';
import { FontAwesome } from '@expo/vector-icons';
const BASE_URL = "http://3.101.60.200:8080";

const Profile = ({ route, navigation }) => {
  const { user, signOut, token, isSignedIn } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [userlistings, setUserListings] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(noProfilePhoto);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = () => {
    navigation.navigate('Category', { searchQuery });
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
        console.log("User Profile Data:", userProfileData);
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
        <TouchableOpacity onPress={() => handleSeeMore(category)} style={styles.seeMoreButton}>
        <View style={styles.buttonContent}>
          <View style={styles.circle}>
            <Text style={styles.dots}>•••</Text>
          </View>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#364a54" />
      </View>
    );
  }

  return (
    
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.sellerInfoContainer}>
        <Image style={styles.sellerProfileImage} source={profilePicture} />
        <View style={styles.sellerDetails}>
          <Text style={styles.sellerName}>{userProfile?.first_name}</Text>
          <Text style={styles.sellerUsername}>@{userProfile?.username}</Text>
          {userProfile && (
          <View style={styles.sellerRating}>
            {[...Array(5)].map((_, i) => (
              <FontAwesome 
                key={i} 
                name="star" 
                size={14} 
                color={i < userProfile.ratings ? "#ffc107" : "#ccc"} 
              />
            ))}
            <Text style={styles.ratingCount}>({userProfile.number_of_ratings})</Text>
          </View>
          )}
          <Text style={styles.sellerStatus}>Active today</Text>
        </View>
      </View>
      <TouchableOpacity onPress={navigateToSettings} style={styles.editProfileButton}>
        <View style={styles.editProfileContent}>
          <View style={styles.iconContainer}>
            <Image source={pencil} style={styles.editIcon} />
          </View>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* My Listings */}
      <View style={styles.centeredContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          {userlistings.length === 0 ? (
            <TouchableOpacity onPress={() => navigation.navigate('Info')}>
              <View style={styles.emptyStateContainer}>
                <Image source={selling} style={styles.emptyImage} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.itemList}>
              {userlistings.slice(0, 6).map((item) => renderListingItem({ item }))}
            </View>
          )}
          {renderSeeMoreButton('userlistings')}
        </View>
      </View>

      {/* Favorites */}
      <View style={styles.centeredContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Favorites</Text>
          {userFavorites.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Image source={savefavorites} style={styles.emptyImage} />
            </View>
          ) : (
            <View style={styles.itemList}>
              {userFavorites.slice(0, 6).map(renderFavoriteItem)}
            </View>
          )}
          {renderSeeMoreButton('userfavorites')}
        </View>
      </View>
        
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 20,
    backgroundColor: '#f2efe9',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2efe9',
  },
  sellerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  sellerProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
    backgroundColor: 'gray',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'rigsans-bold',
  },
  sellerUsername: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'basicsans-regularit',
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingCount: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 12,
  },
  sellerStatus: {
    fontSize: 12,
    color: 'gray',
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
    fontFamily: 'rigsans-bold',
  },
  userUsername: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'basicsans-regularit'
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'rigsans-bold',
  },
  emptyStateContainer: {
    width: 225,
    height: 200,
    backgroundColor: '#fcfbfa',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#293e49',
    borderWidth: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  emptyText: {
    fontSize: 16,
    color: '#364a54',
  },
  emptyImage: {
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
  },
  centeredSection: {
    alignItems: 'center', 
    width: '100%',
  },
  singleItemContainer: {
    alignItems: 'flex-start', 
    paddingLeft: 0, 
  },
  itemList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
    maxWidth: '100%', 
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
    width: 115,
    height: 115,
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  seeMoreButton: {
    backgroundColor: '#293e49',
    paddingVertical: 5,
    borderRadius: 50,
    marginVertical: 10,
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
  },
  dots: {
    color: '#293e49',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMoreText: {
    color: 'white',
    fontFamily: 'basicsans-regular',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
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
  editProfileButton: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    backgroundColor: '#293e48',
    borderRadius: 25,
    paddingHorizontal: 2,
    paddingVertical: 2,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  editProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  editIcon: {
    width: 14,
    height: 14,
  },
  editProfileText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'basicsans-regular',
  },
  
});

export default Profile;



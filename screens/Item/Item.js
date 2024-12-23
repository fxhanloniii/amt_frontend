import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, Alert, Share } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useAuth } from '../../AuthContext/AuthContext';
import Swiper from 'react-native-swiper';
import SettingsIcon from '../../assets/images/settingsicon.png';
import HeartIcon from '../../assets/images/heart.png';
import HeartFilledIcon from '../../assets/images/heart2.png';
import PencilIcon from '../../assets/images/pencil.png';
import TrashIcon from '../../assets/images/trashcan.png';
import LocationPinIcon from '../../assets/images/location-pin.png';
import Money from '../../assets/images/money.png';
import * as ImagePicker from 'expo-image-picker';
import { formatDistanceToNow } from 'date-fns';



const BASE_URL = "http://3.101.60.200:8080";

const Item = ({ route, navigation }) => {
  const [item, setItem] = useState(null);
  const [inputMessage, setInputMessage] = useState('Still available?');
  const { user, token } = useAuth();
  const [itemImages, setItemImages] = useState([]);
  const [isDeleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteIcon, setFavoriteIcon] = useState(HeartIcon);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [isEditLocationModalOpen, setEditLocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [editImagesOpen, setEditImagesOpen] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 37.78825,  // Default latitude, you can adjust these values
    longitude: -122.4324,  // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  


  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const itemId = route.params.itemId;
        const response = await fetch(`${BASE_URL}/items/${itemId}/`);
  
        if (response.ok) {
          const itemData = await response.json();
          setItem(itemData);
          setEditTitle(itemData.title);
          setEditPrice(itemData.price.toString());
          setEditDescription(itemData.description);
          setEditLocation(itemData.zip_code);
  
          // Extract and set image URLs
          const imageUrls = itemData.images.map((img) => img.image);
          setItemImages(imageUrls);
  
          console.log("Fetched Item Data:", itemData);
  
          // Set region based on zip code if latitude and longitude are not directly available
          if (itemData.zip_code) {
            const locationResponse = await fetch(`https://api.zippopotam.us/us/${itemData.zip_code}`);
            if (locationResponse.ok) {
              const locationData = await locationResponse.json();
              const place = locationData.places[0];
              const latitude = parseFloat(place.latitude);
              const longitude = parseFloat(place.longitude);
  
              setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
  
              // Set city and state based on zip code data
              setCity(place['place name']);
              setState(place['state abbreviation']);
              console.log(city, state)
            } else {
              console.error("Failed to fetch location data");
            }
          }
        } else {
          console.error("Failed to fetch item data");
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const checkIfFavorited = async () => {
      try {
        const response = await fetch(`${BASE_URL}/favorites/check/${route.params.itemId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
          setFavoriteIcon(data.isFavorited ? HeartFilledIcon : HeartIcon);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
  
    fetchItemData();
    checkIfFavorited();
  }, [route.params.itemId, token]);
  
  
  const handleSaveLocation = async () => {
    if (editLocation) {
      try {
        // Fetch the new location data based on the entered zip code
        const locationResponse = await fetch(`https://api.zippopotam.us/us/${editLocation}`);
        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          const place = locationData.places[0];
          setCity(place['place name']);  // Update the city
          setState(place['state abbreviation']);  // Update the state
          
          // Update the item with the new zip code and location
          setItem(prevItem => ({
            ...prevItem,
            zip_code: editLocation,
            location: `${place['place name']}, ${place['state abbreviation']}`,
          }));
  
          // Optionally, update the map view here based on the new location coordinates
        } else {
          console.error('Failed to fetch location data');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
    closeEditLocationModal();  // Close the modal
  };
  

  const handleMessageSeller = async () => {
    if (!inputMessage.trim()) {
      console.error('Input message is empty');
      return;
    }

    const response = await fetch(`${BASE_URL}/start-conversation/${item.id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
            initialMessage: inputMessage, 
        }),
    });

    if (response.ok) {
        const data = await response.json();
        navigation.navigate('Message', { 
          conversationId: data.conversation_id,
          itemDetails: item,
         });
    } else {
        console.error('Failed to start conversation');
    }
  };

  const openDeleteItemModal = () => {
    setDeleteItemModalOpen(true);
  };

  const closeDeleteItemModal = () => {
    setDeleteItemModalOpen(false);
  };

  const openEditLocationModal = () => {
    setEditLocationModalOpen(true);
  };

  const closeEditLocationModal = () => {
    setEditLocationModalOpen(false);
  };

  const handleFavoriteToggle = async () => {
    try {
      const response = await fetch(`${BASE_URL}/favorites/toggle/${item.id}/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
        setFavoriteIcon(!isFavorited ? HeartFilledIcon : HeartIcon);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const timeAgo = item ? formatDistanceToNow(new Date(item.date_posted), { addSuffix: true }) : '';


  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this item: ${item.title}\n${item.description}\nPrice: $${item.price}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Item shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing item:', error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      const response = await fetch(`${BASE_URL}/items/${item.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        navigation.goBack(); 
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSaveListing = async () => {
    // Save edited item details here
    try {
      const response = await fetch(`${BASE_URL}/items/${item.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          price: editPrice,
          description: editDescription,
          zip_code: editLocation,
          location: `${city}, ${state}`,
        }),
      });

      if (response.ok) {
        const updatedItemData = await response.json();
        console.log('Response:', updatedItemData);
        setItem(updatedItemData);
        setEditMode(false);
      } else {
        console.error('Failed to save listing');
      }
    } catch (error) {
      console.error('Error saving listing:', error);
    }
  };

  const handleDeleteImage = async (index) => {
    const imageToDelete = item.images[index];
    
    if (!imageToDelete || !imageToDelete.id) {
      console.error('Image ID not found for deletion');
      return;
    }
  
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete", 
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/items/images/${imageToDelete.id}/`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Token ${token}`,
                },
              });
  
              if (response.ok) {
                // Remove the image from the state after successful deletion
                setItemImages(prevImages => prevImages.filter((_, imgIndex) => imgIndex !== index));
                setItem(prevItem => ({
                  ...prevItem,
                  images: prevItem.images.filter((_, imgIndex) => imgIndex !== index)
                }));
                console.log('Image deleted successfully');
              } else {
                console.error('Failed to delete image');
              }
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
      ]
    );
  };
  
  

  const handleMarkAsSold = () => {
    // Navigate to the SelectBuyerScreen with the itemId as a parameter
    navigation.navigate('SelectBuyer', { itemId: item.id });
  };


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#364a54" />
      </View>
    );
  }

  const handleAddAdditionalPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setNewImages(selectedImages);  // Store the new images in the state
        setItemImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
    }
  };
  
  // Modify the editImages function to open the modal
  const editImages = () => {
    setEditImagesOpen(true);
  };

  const uploadAdditionalPhotos = async (images) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image,
        type: 'image/jpeg',
        name: `image-${index}.jpg`,
      });
    });
  
    try {
      const response = await fetch(`${BASE_URL}/items/${item.id}/add-photos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Additional photos uploaded successfully:', data);
        return data.image_urls;
      } else {
        console.error('Failed to upload additional photos:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading additional photos:', error);
    }
    return [];
  };
  
  
  const handleSaveAdditionalPhotos = async () => {
    setIsUploading(true);  // Disable the button to prevent multiple submissions
  
    // Upload additional photos using the newImages state variable
    const uploadedImageUrls = await uploadAdditionalPhotos(newImages);
  
    if (uploadedImageUrls.length > 0) {
      // Update your UI with the newly added image URLs
      setItemImages(prevImages => [...prevImages, ...uploadedImageUrls]);
    }
  
    // Close the modal regardless of whether new images were uploaded or not
    setEditImagesOpen(false);
    setIsUploading(false);  // Re-enable the button for future use
  };
  
  
  

  const isCurrentUserOwner = user && user.pk === item.seller;

  

  return (
    <ScrollView style={styles.scrollView}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.backButton}>{'< Back'}</Text>
        </TouchableOpacity>

        {/* Right Side Icons (Favorite and Share) */}
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Image source={require('../../assets/images/share.png')} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.headerButton}>
            <Image source={favoriteIcon} style={styles.favoriteIcon} />
          </TouchableOpacity>
        </View>
      </View>

      
      <Modal visible={isDeleteItemModalOpen} animationType="slide">
          <View style={styles.modalContainer}>
              <Text style={styles.header}>Delete Item</Text>
              <Text style={styles.confirmationText}>
                  Are you sure you want to delete this item?
              </Text>
              <View style={styles.buttonContainerBottom}>
                  <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                          handleDeleteItem();
                          closeDeleteItemModal();
                      }}
                  >
                      <View style={styles.buttonSymbol}>
                          <Image source={TrashIcon} style={styles.iconImage} />
                      </View>
                      <Text style={styles.deleteButtonText}>Delete Item</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={closeDeleteItemModal}
                  >
                      <View style={styles.buttonSymbol}>
                          <Text style={styles.symbolText}>{'x'}</Text>
                      </View>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      <Modal visible={isEditLocationModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
        <Text style={styles.header}>Edit Location</Text>


          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          >
            {region.latitude && region.longitude && (
              <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
            )}
          </MapView>

          <TextInput
            style={styles.locationInput} // Reusing locationInput style from the item page
            placeholder="Enter zip code"
            value={editLocation}
            onChangeText={async (text) => {
              setEditLocation(text);

              // Fetch location data and update map region
              try {
                const locationResponse = await fetch(`https://api.zippopotam.us/us/${text}`);
                if (locationResponse.ok) {
                  const locationData = await locationResponse.json();
                  const place = locationData.places[0];
                  const latitude = parseFloat(place.latitude);
                  const longitude = parseFloat(place.longitude);

                  // Update the map region with new coordinates
                  setRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });

                  // Update city and state
                  setCity(place['place name']);
                  setState(place['state abbreviation']);
                }
              } catch (error) {
                console.error('Failed to fetch location data:', error);
              }
            }}
          />

          <View style={styles.buttonContainerBottom}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
              <View style={styles.buttonSymbol}>
                <Text style={styles.symbolText}>{'>'}</Text>
              </View>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={closeEditLocationModal}>
              <View style={styles.buttonSymbol}>
                <Text style={styles.symbolText}>{'x'}</Text>
              </View>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={editImagesOpen} animationType="slide">
          <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.imageGrid}>
                  {itemImages.map((imageUri, index) => (
                      <View key={index} style={styles.imageWrapper}>
                          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                          <TouchableOpacity
                              style={styles.deleteImageButton}
                              onPress={() => handleDeleteImage(index)}
                          >
                              <Image source={TrashIcon} style={styles.deleteIcon} />
                          </TouchableOpacity>
                      </View>
                  ))}
              </ScrollView>
              <View style={styles.buttonContainerBottomEditImages}>
                  <TouchableOpacity
                      style={styles.addPhotosButton}
                      onPress={handleAddAdditionalPhotos}
                  >
                      <View style={styles.buttonSymbol}>
                          <Image source={require('../../assets/images/camera.png')} style={styles.iconImage} />
                      </View>
                      <Text style={styles.addPhotosButtonText}>Add Additional Photos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.saveButton, isUploading && styles.disabledButton]} // Optional: add a disabled style
                      onPress={handleSaveAdditionalPhotos}
                      disabled={isUploading} // Disable the button while uploading
                  >
                      <View style={styles.buttonSymbol}>
                          <Text style={styles.symbolText}>{'>'}</Text>
                      </View>
                      <Text style={styles.saveButtonText}>
                          {isUploading ? 'Uploading...' : 'Save Photos'}
                      </Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {itemImages.length > 0 && (
            <Swiper
            style={styles.wrapper}
            showsButtons={true}
            autoplay={false}  
            nextButton={<Text style={styles.buttonText}>›</Text>}
            prevButton={<Text style={styles.buttonText}>‹</Text>}
            dotStyle={styles.dotStyle}  
            activeDotStyle={styles.activeDotStyle}
            paginationStyle={styles.pagination} 
          >
            {itemImages.map((imageUrl, index) => (
              <View key={index} style={styles.slide}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
              </View>
            ))}
          </Swiper>
          )}

          {/* Place favorite button here inside imageContainer */}
          <View style={styles.buttonContainer}>
        {isEditMode ? (
          <TouchableOpacity style={styles.editImagesButton} onPress={editImages}>
            <Text style={styles.editImagesButtonText}>Edit Images</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
            
          </TouchableOpacity>
        )}
        </View>
          
        </View>

        <View style={styles.titleContainer}>
          {isEditMode ? (
            <TextInput
              style={styles.titleInput}
              value={editTitle}
              onChangeText={setEditTitle}
            />
          ) : (
            <Text style={styles.title}>{item.title}</Text>
          )}
          
        <View style={styles.locationContainer}>
            <Image source={LocationPinIcon} style={styles.locationIcon} />
            <Text 
              style={[styles.location, isEditMode && styles.locationEditable]} 
              onPress={isEditMode ? openEditLocationModal : null}  
            >
              {isEditMode && editLocation ? `${city}, ${state}` : `${city}, ${state}`}
            </Text>
          </View>
        </View>


        {isEditMode ? (
          <TextInput
            style={styles.priceInput}
            value={editPrice}
            onChangeText={setEditPrice}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.price}>
            {item.price === 0 ? 'FREE' : `$${item.price}`}
          </Text>
        )}

        <Text style={styles.timestamp}>Listed {timeAgo}</Text>

        

        {!isCurrentUserOwner && (
  // Render the Message Seller section only if the current user is not the owner
  <>
    <View style={styles.divider}/>
    <View style={styles.messageBox}>
      <TextInput
        style={styles.messageInput}
        placeholder="Still available?"
        placeholderTextColor="#364a54"
        editable={true}
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <TouchableOpacity style={styles.messageButton} onPress={handleMessageSeller}>
        <Text style={styles.messageButtonText}>Message Seller</Text>
      </TouchableOpacity>
    </View>
  </>
)}

        {/* Divider */}
        <View style={styles.divider} />

        <Text style={styles.descriptionTitle}>Description:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.descriptionInput}
            value={editDescription}
            onChangeText={setEditDescription}
            multiline
          />
        ) : (
          <Text style={styles.description}>{item.description}</Text>
        )}

        {/* Divider */}
        <View style={styles.divider} />
      {/* Seller Information */}
      <View style={styles.sellerContainer}>
        <Text style={styles.sellerTitle}>Seller Information:</Text>
        <View style={styles.sellerInfo}>
          <Image
            source={{ uri: item.seller_profile.profile_picture_url }}
            style={styles.sellerProfilePicture}
          />
          <View style={styles.sellerDetails}>
            <Text style={styles.sellerName}>{item.seller_profile.first_name}</Text>
            <Text style={styles.sellerUsername}>@{item.seller_profile.username}</Text>
            <View style={styles.sellerRatingContainer}>
              <Text style={styles.sellerRatingStars}>
                {"★".repeat(item.seller_profile.ratings)}
                {"☆".repeat(5 - item.seller_profile.ratings)}
              </Text>
              <Text style={styles.sellerRatingCount}>({item.seller_profile.number_of_ratings})</Text>
            </View>
            <Text style={styles.sellerStatus}>{item.seller_profile.is_active ? "Active today" : "Inactive"}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Location Section */}
      <Text style={styles.locationTitle}>Location:</Text>
        <View style={styles.mapContainer}>
          {region ? (
            <MapView
              style={styles.map}
              region={region}
            >
              <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
              <Circle 
                center={{ latitude: region.latitude, longitude: region.longitude }} 
                radius={2500} 
                fillColor="rgba(0, 0, 0, 0.2)" 
                strokeColor="rgba(0, 0, 0, 0.5)"
              />
            </MapView>
          ) : (
            <Text style={styles.noLocationText}>Location data not available</Text>
          )}
          {/* City and State */}
          {city && state ? (
            <Text style={styles.locationText}>{city}, {state}</Text>
          ) : (
            <Text style={styles.locationText}>Location not available</Text>
          )}
        </View>

      
        {isCurrentUserOwner && (
  <View style={styles.buttonContainerBottom}>
    {isEditMode ? (
      // Render Save Listing and Mark as Sold buttons in edit mode
      <>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveListing}>
          <View style={styles.buttonSymbol}>
            <Text style={styles.symbolText}>{'>'}</Text>
          </View>
          <Text style={styles.saveButtonText}>Save Listing</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.markAsSoldButton} onPress={handleMarkAsSold}>
          <View style={styles.buttonSymbol}>
            <Image source={Money} style={styles.iconImage} />
          </View>
          <Text style={styles.markAsSoldButtonText}>Mark As Sold</Text>
        </TouchableOpacity>
      </>
    ) : (
      // Render Edit Listing and Delete Post buttons in non-edit mode
      <>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
          <View style={styles.editIcon}>
            <Image source={PencilIcon} style={styles.iconImage} />
          </View>
          <Text style={styles.editButtonText}>Edit Listing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={openDeleteItemModal}>
          <View style={styles.buttonSymbol}>
            <Image source={TrashIcon} style={styles.iconImage} />
          </View>
          <Text style={styles.deleteButtonText}>Delete Post</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
)}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f2efe9',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'rigsans-bold',
    marginBottom: 20,
},
  container: {
    padding: 16,
    backgroundColor: '#f2efe9',
    paddingTop: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10 ,
    marginBottom: 0,
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 0,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'rigsans-bold',
    paddingLeft: 0,
  },
  shareIcon: {
    width: 24,
    height: 24,
    tintColor: 'black', 
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    marginBottom: 5,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingTop: 0, 
    marginTop: 0,
    position: 'relative'
  },
  buttonContainer: {
    position: 'absolute',
    top: 32,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15, 
    right: 10, 
    zIndex: 1,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 4,
  },
  settingsButton: {
    zIndex: 1,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  wrapper: {
    height: 300,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  pagination: {
    bottom: -10, 
  },
  dotStyle: {
    backgroundColor: 'transparent',  
    borderWidth: 1,  
    borderColor: 'gray',  
    width: 8,  
    height: 8,  
    borderRadius: 5,  
    marginHorizontal: 3,  
  },
  activeDotStyle: {
    backgroundColor: '#364a54',  
    borderWidth: 1,
    borderColor: '#364a54',  
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  buttonText: {
    color: '#364a54',
    fontSize: 24,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'cover',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 4,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#364a54',
    flex: 1, 
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, 
  },
  locationIcon: {
    width: 18, 
    height: 18,
    marginRight: 5, 
    tintColor: '#9e3f19'
  },
  location: {
    fontSize: 12,
    color: '#9e3f19',
    fontFamily: 'basicsans-regular', 
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#364a54',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#364a54',
  },
  timestamp: {
    fontSize: 14,
    color: '#6e6e6e',
    marginBottom: 4,
    fontFamily: 'basicsans-regularit'
  },
  priceInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#364a54',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#364a54',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#364a54',
    fontFamily: 'basicsans-regular',
  },
  descriptionInput: {
    fontSize: 16,
    marginBottom: 10,
    color: '#364a54',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#364a54',
  },
  locationInput: {
    fontSize: 16,
    marginBottom: 10,
    color: '#364a54',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 4,
  },
  messageBox: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'gray',
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#fcfbfa',
    position: 'relative',
  },
  messageInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    marginBottom: 50,
  },
  messageButton: {
    backgroundColor: '#364a54',
    padding: 8,
    borderRadius: 4,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  messageButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonContainerBottom: {
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  editButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    marginBottom: 10,
    width: '100%',
  },
  deleteButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    width: '100%',
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  editIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: '#293e48', 
  },
  deleteIconImage: {
    width: 20,
    height: 20,
    tintColor: '#293e48', 
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f2efe9',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#364a54',
    fontFamily: 'rigsans-bold',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#364a54',
  },
  deleteItemButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteItemButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2efe9',
  },
  saveButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    width: '100%',
    alignSelf: 'center',
  },
  saveButtonText: {
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
  markAsSoldButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    marginBottom: 10,
    width: '100%',
    marginTop: 10,
  },
  markAsSoldButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  editImagesButton: {
    position: 'absolute',
    top: -8,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.0)', 
    padding: 10,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 1,
  },
  editImagesButtonText: {
    color: 'white',
    fontFamily: 'basicsans-regular',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48', 
    width: '95%',
    alignSelf: 'center',
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
    lineHeight: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f2efe9',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    position: 'relative',
    width: '48%',
    height: 150,
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 5,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },
  addPhotosButton: {
      flexDirection: 'row',
      padding: 4,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 50,
      backgroundColor: '#364a54',
      width: '100%',
      alignSelf: 'center',
      marginBottom: 10,
  },
  addPhotosButtonText: {
    color: 'white',
      fontSize: 18,
      fontFamily: 'basicsans-regular',
      flex: 1,
      textAlign: 'center',
      marginLeft: -10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: 300, // or any specific height
  },
  saveButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    width: '100%',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  cancelButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50, // Match the design
    backgroundColor: '#ccc', // Background color
    width: '100%',
    alignSelf: 'center',
    marginTop: 10, // Space between buttons
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  locationInput: {
    fontSize: 16,
    color: '#364a54',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'white',
    marginTop: 10, // Space between map and input
  },
  buttonContainerBottomEditImages: { // New container style for the Edit Images modal
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
    bottom: 32,  // Ensure the buttons are visible within the screen
},
sellerContainer: {
  marginTop: 5,
  marginBottom:5,
  padding: 0,
  backgroundColor: '#f2efe9',
  borderRadius: 8,
},
sellerTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#364a54',
  marginBottom: 10,
},
sellerInfo: {
  flexDirection: 'row',
  alignItems: 'center',
},
sellerProfilePicture: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#293e48', // Fallback color if image is missing
  marginRight: 10,
},
sellerDetails: {
  flexDirection: 'column',
},
sellerName: {
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'rigsans-bold',
  color: '#364a54',
},
sellerUsername: {
  fontSize: 12,
  color: '#6e6e6e',
  marginBottom: 2,
  fontFamily: 'basicsans-regular',
},
sellerRatingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},
sellerRatingStars: {
  fontSize: 14,
  color: '#ffd700', 
  color: '#364a54',
},
sellerRatingCount: {
  fontSize: 14,
  color: '#6e6e6e',
  marginLeft: 5,
},
sellerStatus: {
  fontSize: 12,
  color: '#6e6e6e',
  fontFamily: 'basicsans-regularit'
},
mapContainer: {
  position: 'relative',
  height: 350,
  borderRadius: 8,
  overflow: 'hidden',
  marginBottom: 16,
},

locationText: {
  fontSize: 14,
  color: '#364a54',
  textAlign: 'left',
  marginTop: 8,
  fontFamily: 'rigsans-bold',
},

});

export default Item;

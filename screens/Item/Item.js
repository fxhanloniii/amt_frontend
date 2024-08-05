import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../AuthContext/AuthContext';
import Swiper from 'react-native-swiper';
import SettingsIcon from '../../assets/images/settingsicon.png';
import HeartIcon from '../../assets/images/heart.png';
import HeartFilledIcon from '../../assets/images/heart2.png';
import PencilIcon from '../../assets/images/pencil.png';
import TrashIcon from '../../assets/images/trashcan.png';
const BASE_URL = 'http://localhost:8000';

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
          setEditLocation(itemData.zipCode);
          // Extract and set image URLs
          const imageUrls = itemData.images.map(img => img.image);
          setItemImages(imageUrls);
        } else {
          console.error('Failed to fetch item data');
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemData();

    const checkIfFavorited = async () => {
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
    };

    checkIfFavorited();
  }, [route.params.itemId]);

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
  };

  const handleMarkAsSold = async () => {
    // Mark the item as sold
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#364a54" />
      </View>
    );
  }

  const isCurrentUserOwner = user && user.pk === item.seller;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
          <Image source={favoriteIcon} style={styles.favoriteIcon} />
        </TouchableOpacity>
        {isCurrentUserOwner && !isEditMode && (
          <TouchableOpacity style={styles.settingsButton} onPress={() => setEditMode(true)}>
              <Image source={SettingsIcon} style={styles.settingsIcon} />
          </TouchableOpacity>
        )}
      </View>
      <Modal visible={isDeleteItemModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Delete Item</Text>
          <Text style={styles.confirmationText}>
            Are you sure you want to delete this item?
          </Text>
          <TouchableOpacity
            style={styles.deleteItemButton}
            onPress={() => {
              handleDeleteItem();
              closeDeleteItemModal();
            }}
          >
            <Text style={styles.deleteItemButtonText}>Delete Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeDeleteItemModal}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isEditLocationModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter zip code"
            value={editLocation}
            onChangeText={setEditLocation}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              // Save the new location
              closeEditLocationModal();
            }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeEditLocationModal}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {itemImages.length > 0 && (
            <Swiper style={styles.wrapper} showsButtons={true} autoplay={true} nextButton={<Text style={styles.buttonText}>›</Text>}
            prevButton={<Text style={styles.buttonText}>‹</Text>}
            dotColor="gray"
            activeDotColor="#364a54">
              {itemImages.map((imageUrl, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={{uri: imageUrl}} style={styles.image} />
                </View>
              ))}
            </Swiper>
          )}
        </View>

        {isEditMode ? (
          <TextInput
            style={styles.titleInput}
            value={editTitle}
            onChangeText={setEditTitle}
          />
        ) : (
          <Text style={styles.title}>{item.title}</Text>
        )}

        {isEditMode ? (
          <TextInput
            style={styles.priceInput}
            value={editPrice}
            onChangeText={setEditPrice}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.price}>${item.price}</Text>
        )}

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

        <Text style={styles.locationTitle}>Location:</Text>
        {isEditMode ? (
          <TouchableOpacity onPress={openEditLocationModal}>
            <Text style={styles.locationInput}>{editLocation}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.location}>{item.zipCode || item.location}</Text>
        )}

        {isCurrentUserOwner && isEditMode ? (
          <View style={styles.buttonContainerBottom}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveListing}>
              <Text style={styles.saveButtonText}>Save Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.markAsSoldButton} onPress={handleMarkAsSold}>
              <Text style={styles.markAsSoldButtonText}>Mark As Sold</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editImagesButton} onPress={() => {}}>
              <Text style={styles.editImagesButtonText}>Edit Images</Text>
            </TouchableOpacity>
          </View>
        ) : (
          !isCurrentUserOwner && (
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
          )
        )}
        {isCurrentUserOwner && !isEditMode && (
          <View style={styles.buttonContainerBottom}>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
              <Image source={PencilIcon} style={styles.editIcon} />
              <Text style={styles.editButtonText}>Edit Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={openDeleteItemModal}>
              <Image source={TrashIcon} style={styles.deleteIcon} />
              <Text style={styles.deleteButtonText}>Delete Post</Text>
            </TouchableOpacity>
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
  container: {
    padding: 16,
    backgroundColor: '#f2efe9',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    marginBottom: 5,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  favoriteButton: {
    marginRight: 8,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    zIndex: 1,
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
  },
  buttonText: {
    color: '#364a54',
    fontSize: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#364a54',
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
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#364a54',
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
  },
  descriptionInput: {
    fontSize: 16,
    marginBottom: 10,
    color: '#364a54',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 4,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#364a54',
  },
  location: {
    fontSize: 16,
    marginBottom: 10,
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
    marginTop: 20,
  },
  editButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    marginBottom: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#f44336',
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
    width: 24,
    height: 24,
  },
  deleteIcon: {
    width: 24,
    height: 24,
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
    backgroundColor: '#293e48',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  markAsSoldButton: {
    backgroundColor: '#293e48',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  markAsSoldButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editImagesButton: {
    backgroundColor: '#293e48',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  editImagesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Item;

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../AuthContext/AuthContext';
import Swiper from 'react-native-swiper';
import SettingsIcon from '../../assets/images/settingsicon.png';
import HeartIcon from '../../assets/images/heart.png';
import HeartFilledIcon from '../../assets/images/heart2.png';
const BASE_URL = 'http://3.101.60.200:8000';

const Item = ({ route, navigation }) => {
  const [item, setItem] = useState(null);
  const [inputMessage, setInputMessage] = useState('Still available?');
  const { user, token } = useAuth();
  const [itemImages, setItemImages] = useState([]);
  const [isDeleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteIcon, setFavoriteIcon] = useState(HeartIcon);

  

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const itemId = route.params.itemId;
        const response = await fetch(`${BASE_URL}/items/${itemId}/`);

        if (response.ok) {
          const itemData = await response.json();
          setItem(itemData);
          // Extract and set image URLs
          const imageUrls = itemData.images.map(img => img.image);
          setItemImages(imageUrls);
          console.log(itemImages)
        } else {
          console.error('Failed to fetch item data');
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
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
        console.log(data)
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
      
      console.log("Item deleted");
      
      navigation.goBack(); 
    } else {
      // Handle error
      console.error('Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

  if (!item) {
    return (
      <View>
        <Text>Loading...</Text>
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
        {isCurrentUserOwner && (
          <TouchableOpacity style={styles.settingsButton} onPress={openDeleteItemModal}>
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
              // Perform the delete item function here
              // After deleting, close the modal
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
    <View style={styles.container}>
      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        {/* Swiper for Images */}
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

      {/* Item Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Price */}
      <Text style={styles.price}>${item.price}</Text>

      {/* Description */}
      <Text style={styles.descriptionTitle}>Description:</Text>
      <Text style={styles.description}>{item.description}</Text>

      {/* Message Box (Conditionally render based on ownership) */}
      {!isCurrentUserOwner && (
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
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView:{
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
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#364a54',
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
  
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: '#f44336', // Use red color for delete button
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteItemButtonText: {
    color: 'white', // Button text color
    fontWeight: 'bold',
    fontSize: 16, // Font size for button text
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
});

export default Item;
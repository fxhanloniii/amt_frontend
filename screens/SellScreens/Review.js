import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import * as Location from 'expo-location';
const BASE_URL = 'http://13.57.40.111:8000';

const Review = ({ route, navigation }) => {
  
  const {
    selectedImages,
    category,
    title,
    description,
    price,
    isForSale,
    isPriceNegotiable,
  } = route.params;

  const [location, setLocation] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
                return;
      }
  
      let currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(currentLocation);
  
      let address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
  
      if (address.length > 0) {
        setLocation(`${address[0].city}, ${address[0].region}, ${address[0].country}`);
      }
    })();
  }, []);


  // Function to handle the publish button press
  const handlePublish = async () => {
    try {
      setIsLoading(true); 
      setError('');
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('price', price);

      formData.append('isForSale', isForSale);
      formData.append('isPriceNegotiable', isPriceNegotiable);
      formData.append('category', category);
  
      // Append each selected image to the FormData
      selectedImages.forEach((imageUri, index) => {
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg', // Modify this based on your image type
          name: `image_${index}.jpg`, // Modify the extension as needed
        });
      });
  
      const response = await fetch(`${BASE_URL}/upload-item-data-and-images/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
                setIsPublished(true);
        // Navigate to the Item page with the newly created item's ID
        navigation.navigate('Item', { itemId: data.item_id });
      } else {
        console.error('Item creation failed', error);
        setError('Item creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.header}>Selected Photos:</Text>
        <ScrollView horizontal={true}>
          {selectedImages.map((imageUri, index) => (
            <Image
              key={index}
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100, margin: 10 }}
            />
          ))}
        </ScrollView>
      </View>
      
      <Text style={styles.header}>Additional Information:</Text>
      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handlePublish} 
          disabled={isPublished}
        >
          <Text style={styles.nextButtonText}>Publish</Text>
        </TouchableOpacity>
      </View>      
      {isPublished && (
        <View style={styles.publishedMessage}>
          <Text>Your Post has been published.</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              // Navigate to the items page
              navigation.navigate('Item', { itemId: data.id });
            }}
          >
            <Text>Check it out HERE</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'center',
    backgroundColor: '#f2efe9',
  },
  imageContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fcfbfa',
  },
  publishedMessage: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewButton: {
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',     
    width: '100%',            
  },
  nextButton: {
    backgroundColor: '#293e48', 
    borderRadius: 50,          
    padding: 10,               
    alignItems: 'center',      
    marginTop: 10,             
    width: '90%',              
  },
  nextButtonText: {
    color: 'white',            
    fontSize: 18,              
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Review;

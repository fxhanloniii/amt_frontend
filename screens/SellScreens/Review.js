import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';

const Review = ({ route, navigation }) => {
  // Destructure the necessary parameters from the route
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
  const { token } = useAuth();

  useEffect(() => {
    
  }, []);

  const createItem = async (itemData) => {
    try {
      // Make a POST request to create the item
      const response = await fetch('http://localhost:8000/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log('Item created successfully');
      } else {
        console.error('Item creation failed');
      }

      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Propagate the error for handling in the calling function
    }
  };

  // Function to handle the publish button press
  const handlePublish = async () => {
    const itemData = {
      location,
      selectedImages,
      category,
      title,
      description,
      price,
      isForSale,
      isPriceNegotiable,
    };

    try {
      // Create the item and get the response
      const data = await createItem(itemData);

      // Check if the item was created successfully
      if (data && data.id) {
        console.log('Item created successfully');

        // Navigate to the Item page with the newly created item's ID
        navigation.navigate('Item', { itemId: data.id });
        setIsPublished(true);
      } else {
        console.error('Item creation failed');
      }
    } catch (error) {
      console.error('Error creating item:', error);
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

      <Button
        title="Publish"
        onPress={handlePublish}
        disabled={isPublished}
      />

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
  },
  publishedMessage: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewButton: {
    marginTop: 10,
  },
});

export default Review;

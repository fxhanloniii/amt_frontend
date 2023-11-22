import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoPage({ route, navigation }) {
    const { category, title, description, price, isForSale, isPriceNegotiable } = route.params;
    const [selectedImages, setSelectedImages] = useState([]);
    
    // Function to open the image picker
    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        // Add the selected image to the array of selectedImages
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    };
  
    // Function to open the camera for taking a photo
    const takePhoto = async () => {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        // Add the taken photo to the array of selectedImages
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    };
  
    // Function to navigate to the review page
    const goToReview = () => {
      // You can pass the selectedImages array to the review page
      navigation.navigate('Review', { 
        selectedImages,
        category,
        title,
        description,
        price,
        isForSale,
        isPriceNegotiable,
       });
    };
  
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            <Text>Select or take photos of your item:</Text>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <TouchableOpacity onPress={pickImage} style={{ marginRight: 10 }}>
                <Text>Select Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto}>
                <Text>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
    
          {selectedImages.length > 0 && (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text>Selected Photos:</Text>
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
          )}
        </ScrollView>
        
        {selectedImages.length > 0 && (
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            <Button title="Next" onPress={goToReview} />
          </View>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

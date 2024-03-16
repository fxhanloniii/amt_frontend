import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Button, StyleSheet, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function PhotoPage({ route, navigation }) {
    const { category, title, description, price, isForSale, isPriceNegotiable } = route.params;
    const [selectedImages, setSelectedImages] = useState([]);
    
    // Function to open the image picker
    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 1,
        allowsEditing: true,
        
      });
  
      if (!result.canceled) {
        // Add the selected image to the array of selectedImages
        setSelectedImages([...selectedImages, result.uri]);
      }
    };
  
    // Function to open the camera for taking a photo
    const takePhoto = async () => {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        // Add the taken photo to the array of selectedImages
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    };

    // Function to render each selected photo
    const renderPhoto = ({ item }) => (
      <Image source={{ uri: item }} style={styles.photo} />
    );

  
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
        <Text style={styles.header}>Sell an Item</Text>
      <View style={styles.photoOptions}>
        <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
              onPress={pickImage}
              style={[
                  styles.photoButton,
                  selectedImages.length >= 10 && { opacity: 0.5, backgroundColor: 'gray' }, // Adjust as per your limit
              ]}
              disabled={selectedImages.length >= 10} // Disable button if limit is reached
          >
              <Text style={styles.buttonText}>{selectedImages.length > 0 ? "Add Another Photo" : "Select a Photo"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photoGrid}>
        <FlatList
          data={selectedImages}
          renderItem={renderPhoto}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextButton} onPress={goToReview}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f2efe9',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  photoOptions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  photoButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    width: '90%',
    backgroundColor: '#fcfbfa',
    borderRadius: 50,
    marginVertical: 5,
  },
  photoGrid: {
    flex: 1,
    padding: 2,
    alignItems: 'center',
  },
  photo: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    margin: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonText: {
    fontSize: 16,
    fontFamily: 'BasicSans-Regular',
  }
});

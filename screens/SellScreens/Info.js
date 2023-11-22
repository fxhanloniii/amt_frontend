import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PhotoPage from './Photo.js';

const InfoInputScreen = ({ navigation }) => {
  // Define state variables for user inputs
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isForSale, setIsForSale] = useState(true); // Default to "For Sale"
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(false);

  // Function to handle the "Next" button press
const handleNextPress = () => {
    // Validate user inputs
    if (!category || !title || !description || !price) {
      // Show an error message to the user indicating that all fields are required
      alert("Please fill in all required fields.");
    } else {
      // Navigate to the next screen (PhotoUploadScreen) with user inputs
      navigation.navigate('PhotoPage', {
        category,
        title,
        description,
        price,
        isForSale,
        isPriceNegotiable,
      });
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

   // Define the list of categories
   const categories = [
    'Appliances',
    'Concrete & Brick',
    'Electrical',
    'Hardware',
    'Lumber',
    'Paint',
    'Tile & Masonry',
    'Tools',
  ];

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Category:</Text>
        <View style={styles.categoryContainer}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                category === item && styles.selectedCategory,
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Title:</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={(text) => setTitle(text)}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={(text) => setDescription(text)}
        />

        <Text style={styles.label}>Price:</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter price"
            keyboardType="numeric"
            value={price}
            onChangeText={(text) => setPrice(text)}
        />

        <Text style={styles.label}>For Sale:</Text>
        <TouchableOpacity
            style={[styles.optionButton, isForSale && styles.selectedOption]}
            onPress={() => setIsForSale(true)}
        >
            <Text>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.optionButton, !isForSale && styles.selectedOption]}
            onPress={() => setIsForSale(false)}
        >
            <Text>No</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Price Negotiable:</Text>
        <TouchableOpacity
            style={[styles.optionButton, isPriceNegotiable && styles.selectedOption]}
            onPress={() => setIsPriceNegotiable(!isPriceNegotiable)}
        >
            <Text>{isPriceNegotiable ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  optionButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  nextButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    margin: 4,
  },
  selectedCategory: {
    backgroundColor: 'lightblue',
  },
});

export default InfoInputScreen;

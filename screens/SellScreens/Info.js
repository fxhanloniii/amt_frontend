import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PhotoPage from './Photo.js';
import RNPickerSelect from 'react-native-picker-select';

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
    'Appliances', 'Bath & Faucets', 'Cleaning', 'Concrete & Brick', 
    'Doors & Windows', 'Drywall', 'Electrical', 'Sliding', 
    'Flooring & Rugs', 'Garden & Patio', 'Hardware', 'Heating & Air', 
    'Kitchen', 'Lighting & Fans', 'Lumber', 'Misc.', 'Paint', 
    'Plumbing', 'Roofing', 'Storage', 'Tiles & Masonry', 'Tools'
  ];

  const handleForSaleChange = (saleStatus) => {
    setIsForSale(saleStatus);
  };

  const handlePriceNegotiableChange = () => {
    setIsPriceNegotiable(!isPriceNegotiable);
  };
  
  

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Sell an Item</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={categories.map((cat) => ({ label: cat, value: cat }))}
        style={pickerSelectStyles}
        placeholder={{ label: "Select Category", value: null }}
      />

        <Text style={styles.label}>Title:</Text>
        <TextInput
            style={styles.input}
            placeholder="Ex. Brand, model, color, size"
            value={title}
            onChangeText={(text) => setTitle(text)}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
            style={styles.descriptionInput}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={(text) => setDescription(text)}
        />

      <View style={styles.radioGroup}>
        <TouchableOpacity style={styles.radioOption} onPress={() => setIsForSale(true)}>
          <View style={[styles.radioCircle, isForSale && styles.radioCircleSelected]}>
            {isForSale && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioLabel}>For Sale</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioOption} onPress={() => setIsForSale(false)}>
          <View style={[styles.radioCircle, !isForSale && styles.radioCircleSelected]}>
            {!isForSale && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioLabel}>For Free</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceSection}>
        <TextInput
          style={styles.priceInput}
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <TouchableOpacity style={styles.radioOption} onPress={handlePriceNegotiableChange}>
          <View style={[styles.radioCircle, isPriceNegotiable && styles.radioCircleSelected]}>
            {isPriceNegotiable && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioLabel}>Negotiable</Text>
        </TouchableOpacity>
      </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#fcfbfa',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#fcfbfa',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingBottom: 16,
    backgroundColor: '#f2efe9',
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    fontSize: 14,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fcfbfa',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fcfbfa',
    textAlignVertical: 'top',
    minHeight: 100,
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
    backgroundColor: '#293e48',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    marginTop: 1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    
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
    backgroundColor: '#fcfbfa',
  },
  selectedCategory: {
    backgroundColor: 'lightblue',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: '#000',
  },
  radioCircleInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#293e48', 
  },
  radioLabel: {
    fontSize: 16,
    
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fcfbfa',
    textAlignVertical: 'top',
    marginRight: 8,
  },
  toggleSwitch: {
    marginHorizontal: 12,
  },
  toggleIndicator: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    
  },
  toggleIndicatorActive: {
    backgroundColor: '#000',
    
  },
  toggleLabel: {
    fontSize: 16,
    
  },
  
});

export default InfoInputScreen;

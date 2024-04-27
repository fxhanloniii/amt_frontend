import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from 'react-native';
import PhotoPage from './Photo.js';
import Appliances from '../../assets/images/Appliances.png';
import BathFaucets from '../../assets/images/Bath_Faucets.png';
import Cleaning from '../../assets/images/Cleaning.png';
import ConcreteBrick from '../../assets/images/Concrete_Brick.png';
import DoorsWindows from '../../assets/images/Doors_Windows.png';
import Drywall from '../../assets/images/Drywall.png';
import Electrical from '../../assets/images/Electrical.png';
import Siding from '../../assets/images/Siding.png';
import FlooringRugs from '../../assets/images/Flooring_Rugs.png';
import GardenPatio from '../../assets/images/Garden_Patio.png';
import Hardware from '../../assets/images/Hardware.png';
import HeatingAir from '../../assets/images/Heating_Air.png';
import Kitchen from '../../assets/images/Kitchen.png';
import LightingFans from '../../assets/images/Lighting_Fans.png';
import Lumber from '../../assets/images/Lumber.png';
import Misc from '../../assets/images/Misc.png';
import Paint from '../../assets/images/Paint.png';
import Plumbing from '../../assets/images/Plumbing.png';
import Roofing from '../../assets/images/Roofing.png';
import Storage from '../../assets/images/Storage.png';
import TilesMasonry from '../../assets/images/Tiles_Masonry.png';
import Tools from '../../assets/images/Tools.png';


const InfoInputScreen = ({ navigation }) => {
  // Define state variables for user inputs
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isForSale, setIsForSale] = useState(true); // Default to "For Sale"
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(false);
  const [modalVisible, setModalVisible]= useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  };

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
    toggleModal();
  };

   // Define the list of categories
   const categories = [
    'Appliances', 'Bath & Faucets', 'Cleaning', 'Concrete & Brick', 
    'Doors & Windows', 'Drywall', 'Electrical', 'Sliding', 
    'Flooring & Rugs', 'Garden & Patio', 'Hardware', 'Heating & Air', 
    'Kitchen', 'Lighting & Fans', 'Lumber', 'Misc.', 'Paint', 
    'Plumbing', 'Roofing', 'Storage', 'Tiles & Masonry', 'Tools'
  ];

  const categoryIcons = {
    'Appliances': Appliances,
    'Bath & Faucets': BathFaucets,
    'Cleaning': Cleaning,
    'Concrete & Brick': ConcreteBrick,
    'Doors & Windows': DoorsWindows,
    'Drywall': Drywall,
    'Electrical': Electrical,
    'Siding': Siding,
    'Flooring & Rugs': FlooringRugs,
    'Garden & Patio': GardenPatio,
    'Hardware': Hardware,
    'Heating & Air': HeatingAir,
    'Kitchen': Kitchen,
    'Lighting & Fans': LightingFans,
    'Lumber': Lumber,
    'Misc.': Misc,
    'Paint': Paint,
    'Plumbing': Plumbing,
    'Roofing': Roofing,
    'Storage': Storage,
    'Tiles & Masonry': TilesMasonry,
    'Tools': Tools,
  };

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
        <TouchableOpacity style={styles.selectCategoryButton} onPress={toggleModal}>
          <Text style={styles.selectCategoryButtonText}>Select Category</Text>
        </TouchableOpacity>
        
        <View style={category ? styles.selectedCategory : styles.hiddenCategory}>
        {category && (
          <>
          <Image source={categoryIcons[category]} style={styles.categoryIcon} />
          <Text style={styles.selectedCategoryText}>{category}</Text>
          </>
        )}
        </View>
        
        
            <Modal visible={modalVisible} animationType="slide" onRequestClose={toggleModal}>
            <View style={styles.overlay}>
              <View style={styles.modalContainer}>
              
                <ScrollView style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryItem}
                      onPress={() => handleCategorySelect(cat)}
                      >
                        <View style={styles.selectedCategoryContainer}>
                          <Image source={categoryIcons[cat]} style={styles.categoryIcon} />
                          <Text style={styles.categoryText}>{cat}</Text>
                        </View>
                      </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
              </View>
            </Modal>
        

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
    paddingRight: 30, 
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
    paddingRight: 30, 
    backgroundColor: '#fcfbfa',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#f2efe9',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    fontSize: 14,
    marginVertical: 8,
    fontFamily: 'basicsans-regular',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fcfbfa',
    fontFamily: 'basicsans-regular',
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
    minHeight: 150,
    fontFamily: 'basicsans-regular',
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
    marginTop: 40,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
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
    fontFamily: 'basicsans-regular',
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
    fontFamily: 'basicsans-regular',
    
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
    fontFamily: 'basicsans-regular',
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
    fontFamily: 'basicsans-regular',
  },
  modal: {
    backgroundColor: '#f2efe9',
  },
  modalContainer: {
    paddingTop: 80,
    margin: 20,
    marginBottom: 80,
    backgroundColor: 'white',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 5,

  },
  selectCategoryButton: {
    backgroundColor: '#293e48',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    marginTop: 1,
  },
  selectCategoryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'basicsans-regular',
  },
  selectedCategory: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectedCategoryText: {
    fontSize: 16,
    fontFamily: 'basicsans-regular',
  },
  hiddenCategory: {
    height: 50,
  },
  categoryList: {
    width: '100%',
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'basicsans-regular',
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
  },
  categoryIcon: {
    width: 35, 
    height: 35, 
    marginRight: 10,
  },
  selectedCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default InfoInputScreen;

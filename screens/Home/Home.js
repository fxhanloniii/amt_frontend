import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import * as Location from 'expo-location';
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
import RecentlyPosted from '../../components/RecentlyPosted';
import { useAuth } from '../../AuthContext/AuthContext';

const BASE_URL = 'http://localhost:8000';

export default function Home({ navigation }) {
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState('');
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const { zipCode, user } = useAuth();

  // Full list of categories
  const allCategories = [
    'Concrete & Brick',
    'Doors & Windows',
    'Electrical',
    'Garden & Patio',
    'Hardware',
    'Lumber',
    'Tiles & Masonry',
    'Tools',
    'Appliances', 
    'Bath & Faucets', 
    'Cleaning', 
    'Drywall', 
    'Siding', 
    'Flooring & Rugs', 
    'Heating & Air', 
    'Kitchen', 
    'Lighting & Fans', 
    'Misc.', 
    'Paint', 
    'Plumbing', 
    'Roofing', 
    'Storage'
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

  useEffect(() => {
    if (zipCode) {
      const fetchCityAndState = async () => {
        try {
          const response = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            const place = data.places[0];
            setLocation(`${place['place name']}, ${place['state abbreviation']}`);
          }
        } catch (error) {
          console.error('Error fetching city and state:', error);
        }
      };
      fetchCityAndState();
    }
  }, [zipCode]);

  const openLocationModal = () => {
    setLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setLocationModalOpen(false);
  };

  const handleSaveLocation = () => {
    // Perform validation here to check if the customLocation is in the correct format
    if (isValidLocationFormat(customLocation)) {
      setLocation(customLocation);
      closeLocationModal();
    } else {
      // Show an error message to the user, indicating an invalid format
      alert('Please enter a valid location format (e.g., Los Angeles, CA)');
    }
  };

  const isValidLocationFormat = (location) => {
    // Use a regular expression to check if the format matches "City, State"
    const locationFormatRegex = /^[A-Za-z\s]+,\s[A-Za-z]{2}$/i;
    return locationFormatRegex.test(location);
  };

  const handleSearch = () => {
    navigation.navigate('Category', { searchQuery, zipCode, radius: user.delivery_radius });
  };

  // Function to render a category button
  const renderCategory = (category) => (
    <TouchableOpacity 
      key={category} 
      style={styles.categoryButton} 
      onPress={() => navigation.navigate('Category', { categoryName: category, zipCode, radius: user.delivery_radius })}
    >
      <View style={styles.categoryContent}>
      <Image source={categoryIcons[category]} style={styles.categoryIcon} />
      <View style={styles.categoryTextContainer}>
        <Text style={styles.categoryButtonText}>{category}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.searchBar}
        placeholder="What are you looking for?"
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.categoryLocationContainer}>
        <Text style={styles.titleTopCatergories}>Top Categories</Text>
        <TouchableOpacity style={styles.locationContainer} onPress={openLocationModal}>
          <Text style={styles.locationText}>{customLocation || location}</Text>
        </TouchableOpacity>

        {/* Modal for custom location input */}
      <Modal visible={isLocationModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter Your Location</Text>
          <TextInput
            style={styles.locationInput}
            placeholder="E.g., Los Angeles, CA"
            onChangeText={(text) => setCustomLocation(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeLocationModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      </View>
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        {allCategories.slice(0, viewAll ? allCategories.length : 8).map(renderCategory)}
        
        <TouchableOpacity style={styles.viewAllButton} onPress={() => setViewAll(!viewAll)}>
          <View style={styles.buttonContent}>
            <View style={styles.circle}>
              <Text style={styles.dots}>•••</Text>
            </View>
            <Text style={styles.viewAllButtonText}>{viewAll ? 'View Less' : 'View All Categories'}</Text>
          </View>
        </TouchableOpacity>

        <RecentlyPosted navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2efe9',
        //alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
      },
      searchBar: {
        marginTop: 10,  
        height: 40,
        width: '90%',  
        borderColor: '#d1d1d1',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,  
        paddingRight: 10,
        alignSelf: 'center',
        backgroundColor: 'white', 
    },
    categoryLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      justifyContent: 'space-between',
      width: '90%',
      alignSelf: 'center',
      marginBottom: 10,
  },
    titleTopCatergories: {
      fontSize: 18, 
      fontWeight: 'bold',
      fontFamily:'rigsans-bold',
  },
  locationText: {
    color: '#9e3f19'
  },
  categoryButton: {
    backgroundColor: '#fcfbfa',
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 50,
    margin: 5,
    width: '90%',  
    alignSelf: 'center',  
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#293e49',
    borderWidth: 1,
    borderStyle: 'solid',
},
categoryTextContainer: {
  flex: 1, 
  justifyContent: 'center', 
},
categoryContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
categoryIcon: {
  width: 35, 
  height: 35, 
  marginLeft: 10,
  
},
  categoryButtonText: {
    color: '#293e49',
    textAlign: 'center',
    paddingRight: 30,
    fontFamily: 'basicsans-regular',
    fontSize: 16,
  },

  viewAllButton: {
    backgroundColor: '#293e49',
    paddingVertical: 5,  
    paddingHorizontal: 0,  
    borderRadius: 50,
    margin: 10,
    width: '90%',  
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row',  // Align the circle and text horizontally
    alignItems: 'center',  // Center them vertically
    justifyContent: 'center',  // Ensure the text is centered in the button
    width: '100%',  // Make the content take the full width of the button
    position: 'relative',  // Allow absolute positioning of the circle
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',  // Position the circle absolutely
    left: 2,  // Keep it on the left side
  },
  dots: {
    color: '#293e49',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButtonText: {
    color: 'white',
    fontFamily: 'basicsans-regular',
    fontSize: 16,
    textAlign: 'center',  // Center the text
    flex: 1,  // Allow the text to take up available space
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f2efe9', 
    paddingTop: 50, 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  saveButton: {
    backgroundColor: '#293e49',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

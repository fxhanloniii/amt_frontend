import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

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
    
const BASE_URL = "http://3.101.60.200:8080"; 

export default function Home({ navigation }) {
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState('');
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const { zipCode: userZipCode, user } = useAuth();
  const [customZipCode, setCustomZipCode] = useState(''); // For overriding user's zipCode
  const [radius, setRadius] = useState(25); // Stores the radius entered by the user
  const [region, setRegion] = useState(null);

  // Full list of categories
  const allCategories = [
    'Appliances', 
    'Concrete & Brick',
    'Doors & Windows',
    'Electrical',
    'Garden & Patio',
    'Hardware',
    'Lumber',
    'Tiles & Masonry',
    'Tools',
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
    if (!userZipCode) {
      getLocation(); // Fetch geolocation if no user zip code is provided
    } else {
      fetchCoordinates(userZipCode);
    }
  }, [userZipCode]);

  // Function to get user location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setUserLocation({ latitude, longitude });
      
      // Reverse geocode to get the zip code
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const zip = reverseGeocode[0].postalCode;
      setGeoZipCode(zip); // Set geo-based zip code
      fetchCoordinates(zip); // Fetch coordinates based on the reverse-geocoded zip code
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Could not retrieve location.');
    }
  };

  const fetchCoordinates = async (zip) => {
    try {
      const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
      const data = await response.json();
      const place = data.places[0];
  
      // Ensure the state abbreviation is in uppercase
      const formattedLocation = `${place['place name']}, ${place['state abbreviation'].toUpperCase()}`;
    
      setRegion({
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
  
      setLocation(formattedLocation);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };
  
  

  const openLocationModal = () => {
    setLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setLocationModalOpen(false);
  };

  const handleSaveLocation = async () => {
    if (customZipCode) {
      await fetchCoordinates(customZipCode); // Fetch coordinates for the entered customZipCode
      setLocation(`${customZipCode}`);
      closeLocationModal();
    } else {
      alert('Please enter a valid zip code.');
    }
  };
  

  const isValidLocationFormat = (location) => {
    // Use a regular expression to check if the format matches "City, State"
    const locationFormatRegex = /^[A-Za-z\s]+,\s[A-Za-z]{2}$/i;
    return locationFormatRegex.test(location);
  };

  const handleSearch = () => {
    const zipToUse = customZipCode || userZipCode;  // Use custom or user zipCode
    if (!zipToUse) {
      alert('Please enter a valid zip code.');
      return;
    }
    navigation.navigate('Category', { searchQuery, zipCode: zipToUse, radius });
  };
  

  const renderCategory = (category) => {
    // Ensure you're passing the correct zipCode (either custom or user zipCode)
    const zipToUse = customZipCode || userZipCode;
  
    // Check if zipToUse is defined, otherwise return null to prevent errors
    if (!zipToUse) {
      console.error('Zip code is not available');
      return null;
    }
  
    return (
      <TouchableOpacity 
        key={category} 
        style={styles.categoryButton} 
        onPress={() => navigation.navigate('Category', { categoryName: category, zipCode: zipToUse, radius })}
      >
        <View style={styles.categoryContent}>
          <Image source={categoryIcons[category]} style={styles.categoryIcon} />
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryButtonText}>{category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
 
  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="ios-search" size={20} color="#d1d1d1" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchBar}
          placeholder="What are you looking for?"
          placeholderTextColor="#d1d1d1"
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View style={styles.categoryLocationContainer}>
        <Text style={styles.titleTopCatergories}>Top Categories</Text>
        <TouchableOpacity style={styles.locationContainer} onPress={openLocationModal}>
          <Image source={require('../../assets/images/location-pin.png')} style={styles.locationIcon} />
          <Text style={styles.locationText}>{customLocation || location}</Text>
        </TouchableOpacity>

        <Modal visible={isLocationModalOpen} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Location</Text>

            {region ? (
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
              >
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
              </MapView>
            ) : (
              <ActivityIndicator size="large" color="#364a54" />
            )}
            <Text style={styles.inputLabel}>Zip Code</Text>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter zip code"
              value={customZipCode}
              onChangeText={(text) => setCustomZipCode(text)}
              onSubmitEditing={() => fetchCoordinates(customZipCode || userZipCode)}
            />
            <Text style={styles.inputLabel}>Radius (in miles)</Text>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter radius (in miles)"
              keyboardType="numeric"
              value={radius.toString()}
              onChangeText={(text) => setRadius(Number(text))}
            />

            <View style={styles.buttonContainerBottom}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
                <View style={styles.buttonSymbol}>
                  <Text style={styles.symbolText}>{'>'}</Text>
                </View>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={closeLocationModal}>
                <View style={styles.buttonSymbol}>
                  <Text style={styles.symbolText}>{'x'}</Text>
                </View>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
        justifyContent: 'flex-start',
        width: '100%',
      },
      searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        height: 40,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 0,
        paddingLeft: 10,
        alignSelf: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4,
        elevation: 3, 
      },
      searchIcon: {
        marginRight: 12,
      },
      searchBar: {
        flex: 1, 
        color: '#293e48',
        fontSize: 16,
        fontFamily: 'basicsans-regular',
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',  
    paddingHorizontal: 10,  
  },
  
  locationIcon: {
    width: 18,  
    height: 18,
    marginRight: 4,  
    tintColor: '#9e3f19',
  },
  
  locationText: {
    color: '#9e3f19', 
    fontSize: 14,
    textAlign: 'right',  
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
    borderWidth: 0.25,
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
  width: 42, 
  height: 42, 
  marginLeft: 8,
  
},
  categoryButtonText: {
    color: '#293e49',
    textAlign: 'center',
    paddingRight: 30,
    fontFamily: 'basicsans-regular',
    fontSize: 17,
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
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'rigsans-bold',
    marginBottom: 20,
    paddingTop: 50,
  },
  map: {
    width: '100%',
    height: 300, // Adjust height as needed
    borderRadius: 10,
    marginBottom: 10,
  },
  locationInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fcfbfa', // Matches background color
    color: '#293e48', // Matches text color
  },
  buttonContainerBottom: {
    width: '100%',
    alignItems: 'center',  // Center the buttons
    marginTop: 10,  // Add some spacing between inputs and buttons
  },
  saveButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    width: '100%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  cancelButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#ccc',
    width: '100%',
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#293e48',
    fontSize: 18,
    fontFamily: 'basicsans-regular',
    flex: 1,
    textAlign: 'center',
    marginLeft: -10,
  },
  buttonSymbol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolText: {
    color: '#293e48',
    fontSize: 28,
    fontFamily: 'basicsans-regular',
    alignSelf: 'center',
    lineHeight: 28,
  },
  inputLabel: {
    fontSize: 14,  
    color: '#293e48',  
    marginBottom: 5,  
    alignSelf: 'flex-start',  
    fontFamily: 'basicsans-regular'
  },
  
});

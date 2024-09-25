import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Modal } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import MapView, { Circle, Marker } from 'react-native-maps';
const BASE_URL = 'http://127.0.0.1:8000/';

const CategoryItems = ({ route, navigation }) => {
  const { categoryName, endpoint, zipCode, radius: userRadius, searchQuery: initialSearchQuery } = route.params;
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [loading, setLoading] = useState(true);
  const [outsideItems, setOutsideItems] = useState([]);
  const [loadingOutside, setLoadingOutside] = useState(true);
  const { token } = useAuth();
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const radius = userRadius || 25;
  const [region, setRegion] = useState(null);
  const [customZipCode, setCustomZipCode] = useState('');

  useEffect(() => {
    if (zipCode) {
      const fetchCityAndState = async () => {
        try {
          const response = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            const place = data.places[0];
            setLocation(`${place['place name']}, ${place['state abbreviation']}`);
            setRegion({
              latitude: parseFloat(place.latitude),
              longitude: parseFloat(place.longitude),
              latitudeDelta: 0.0922,  // Adjust the zoom level as needed
              longitudeDelta: 0.0421,
            });
          }
        } catch (error) {
          console.error('Error fetching city and state:', error);
        }
      };
      
      fetchCityAndState();
    }
    const fetchItems = async () => {
      try {
        setLoading(true);
        let apiUrl = `${BASE_URL}/items/?`;
  
        if (searchQuery) {
          apiUrl += `search=${encodeURIComponent(searchQuery)}&`;
        }
  
        if (categoryName) {
          apiUrl += `category=${encodeURIComponent(categoryName)}&`;
        }
  
        if (zipCode) {
          apiUrl += `zip_code=${encodeURIComponent(zipCode)}&radius=${encodeURIComponent(radius)}`;
        }
  
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const itemsData = await response.json();
          setItems(itemsData.reverse());
  
          // Extract the IDs of items within the radius to exclude them later
          const withinRadiusItemIds = itemsData.map(item => item.id).join(',');
  
          // After fetching items within the radius, fetch items outside the radius
          fetchOutsideItems(withinRadiusItemIds);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchOutsideItems = async (withinRadiusItemIds) => {
      try {
        setLoadingOutside(true);
  
        let apiUrl = `${BASE_URL}/items/?outside_radius=1&zip_code=${encodeURIComponent(zipCode)}&radius=${encodeURIComponent(radius)}`;
  
        // Add search query filter if available
        if (searchQuery) {
          apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
        }
  
        // Add category filter if available
        if (categoryName) {
          apiUrl += `&category=${encodeURIComponent(categoryName)}`;
        }
  
        // Exclude items already fetched within the radius
        if (withinRadiusItemIds) {
          apiUrl += `&exclude_ids=${encodeURIComponent(withinRadiusItemIds)}`;
        }
  
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const itemsData = await response.json();
          setOutsideItems(itemsData.reverse());
        } else {
          console.error('Failed to fetch outside radius items');
        }
      } catch (error) {
        console.error('Error fetching outside radius items:', error);
      } finally {
        setLoadingOutside(false);
      }
    };
  
    fetchItems(); // Call the fetchItems function first to load items within the radius
  }, [categoryName, searchQuery, zipCode, radius, token]);
  
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
    const locationFormatRegex = /^[A-Za-z\s]+,\s[A-Za-z]{2}$/i;
    return locationFormatRegex.test(location);
  };
  

  const handleItemPress = (itemId) => {
    navigation.navigate('Item', { itemId });
  };

  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
  };

  const handleSearch = () => {
    navigation.navigate('Category', {
      searchQuery,
      zipCode,
      radius,
    });
  };

  return (
    <View style={styles.container}>
      {/* Location Modal */}
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

          {/* Label for Zip Code */}
          <Text style={styles.inputLabel}>Zip Code</Text>
          <TextInput
            style={styles.locationInput}
            placeholder="Enter zip code"
            value={customZipCode}
            onChangeText={(text) => setCustomZipCode(text)}
            onSubmitEditing={() => fetchCoordinates(customZipCode || zipCode)}
          />

          {/* Label for Radius */}
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


      <TextInput
        style={styles.searchBar}
        placeholder="What are you looking for?"
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.categoryLocationContainer}>
        <Text style={styles.titleCategory}>{categoryName ? categoryName : searchQuery}</Text>
        <View style={styles.locationMainContainer}>
        <TouchableOpacity style={styles.locationContainer} onPress={openLocationModal}>
          <Image source={require('../../assets/images/location-pin.png')} style={styles.locationIcon} />
          <Text style={styles.locationText}>{customLocation || location}</Text>
        </TouchableOpacity>
      </View>

      </View>
      <View style={styles.horizontalLine} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#364a54" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => handleItemPress(item.id)}>
              <View style={styles.itemContainer}>
                <Image
                  source={{ uri: item.images[0]?.image }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemPrice}>{item.price === 0 ? 'FREE' : `$${item.price}`}</Text>
                  <Text style={styles.itemName} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          numColumns={2}
        />
      )}

    {/* {outsideItems.length > 0 && (
      <View>
        <Text style={styles.outsideAreaTitle}>Outside your area</Text>
        <View style={styles.horizontalLine} />
        {loadingOutside ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#364a54" />
          </View>
        ) : (
          <FlatList
            data={outsideItems}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => handleItemPress(item.id)}>
                <View style={styles.itemContainer}>
                  <Image
                    source={{ uri: item.images[0]?.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemPrice}>{item.price === 0 ? 'FREE' : `$${item.price}`}</Text>
                    <Text style={styles.itemName} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
            numColumns={2}
          />
        )}
      </View>
    )} */}

        </View>
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2efe9',
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
    justifyContent: 'space-between', // Ensure items are spaced between
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',  // Push location text and icon to the right
    paddingHorizontal: 10,
  },
  
  locationIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  
  locationText: {
    color: '#9e3f19',
    fontSize: 14,
    textAlign: 'right',
  },
  titleCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    flexGrow: 1,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'gray',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'column',
    width: '45%',
    margin: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 165,
    height: 165,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  itemDetails: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 5,
  },
  itemName: {
    fontSize: 12,
    flex: 2,
    marginLeft: 0,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2efe9',
  },
  outsideAreaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'gray',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
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
  inputLabel: {
    fontSize: 14,  // Adjust the font size as needed
    color: '#293e48',  // Darker color for the label text
    marginBottom: 5,  // Space between the label and input
    alignSelf: 'flex-start',  // Align the label to the left
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
  
  
  
});

export default CategoryItems;

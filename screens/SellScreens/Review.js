import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../AuthContext/AuthContext';
const BASE_URL = 'http://127.0.0.1:8000/';

const { width: screenWidth } = Dimensions.get('window');

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

  const { token, zipCode: userZipCode } = useAuth();
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState(userZipCode || '');
  const [region, setRegion] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (zipCode) {
      fetchCoordinates(zipCode);
    }
  }, [zipCode]);

  const fetchCoordinates = async (zip) => {
    try {
      const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
      const data = await response.json();
      const place = data.places[0];
      setRegion({
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLocation(`${place['place name']}, ${place['state abbreviation']}`);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handlePublish = async () => {
    if (isLoading) return; // Prevent further clicks if already publishing
    try {
      setIsLoading(true); // Disable button and show "Publishing..."
      setError('');
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('zip_code', zipCode);
      formData.append('price', price);
      formData.append('isForSale', isForSale);
      formData.append('isPriceNegotiable', isPriceNegotiable);
      formData.append('category', category);
  
      selectedImages.forEach((imageUri, index) => {
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
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
  

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  return (
    <ScrollView contentContainerStyle={{ justifyContent: 'space-between', paddingBottom: 24 }} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Sell an Item</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        <FlatList
          data={selectedImages}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setActiveSlide(index);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.paginationContainer}>
          {selectedImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeSlide ? styles.paginationDotActive : {},
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemPrice}>
          {price === 0 ? 'FREE' : `$${price}`} 
          {isPriceNegotiable && <Text style={styles.negotiableText}> Negotiable</Text>}
        </Text>
      </View>

      <View>
        {region ? (
          <MapView style={styles.map} region={region}>
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="#364a54" />
        )}
      </View>

      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter zip code"
        value={zipCode}
        onChangeText={(text) => setZipCode(text)}
      />

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarStep, styles.activeStep, styles.roundedLeft]} />
        <View style={[styles.progressBarStep, styles.activeStep]} />
        <View style={[styles.progressBarStep, styles.activeStep, styles.roundedRight]} />
      </View>
      <View style={styles.progressBarLabels}>
        <Text style={[styles.progressLabel, styles.alignLeft]}>Post</Text>
        <Text style={[styles.progressLabel, styles.alignCenter]}>Photos</Text>
        <Text style={[styles.progressLabel, styles.alignRight]}>Finish</Text>
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.nextButton, isLoading && { opacity: 0.5 }]} // Dim button when loading
        onPress={handlePublish}
        disabled={isLoading} // Disable button when loading
      >
        <View style={styles.buttonSymbol}>
          <Text style={styles.symbolText}>{'>'}</Text>
        </View>
        <Text style={styles.nextButtonText}>
          {isLoading ? 'Publishing...' : 'Publish'} {/* Show "Publishing..." when loading */}
        </Text>
      </TouchableOpacity>

      </View>

      {isPublished && (
        <View style={styles.publishedMessage}>
          <Text>Your Post has been published.</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('Item', { itemId: data.id })}
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
    backgroundColor: '#f2efe9',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'rigsans-bold',
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'rigsans-bold',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  carouselImage: {
    width: screenWidth,
    height: 250,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    border: 1,
    borderColor: '#293e48',
    backgroundColor: 'transparent',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#293e48',
  },
  itemDetailsContainer: {
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'basicsans-regular',
    marginVertical: 4,
    color: '#293e48',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'rigsans-bold',
    marginVertical: 4,
  },
  negotiableText: {
    fontWeight: 'normal',
    fontStyle: 'italic',
    fontFamily: 'basicsans-regularit',
    fontSize: 10,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fcfbfa',
    fontFamily: 'basicsans-regularit',
    color: 'gray',
  },
  map: {
    width: '90%',
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: '#293e48',
  },
  roundedLeft: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  roundedRight: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'basicsans-regularit',
    marginBottom: 10,
  },
  alignLeft: {
    textAlign: 'left',
    flex: 1,
  },
  alignCenter: {
    textAlign: 'center',
    flex: 1,
  },
  alignRight: {
    textAlign: 'right',
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f2efe9',
  },
  nextButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    width: '90%',
  },
  nextButtonText: {
    color: 'white',
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
  publishedMessage: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewButton: {
    marginTop: 10,
  },
});

export default Review;

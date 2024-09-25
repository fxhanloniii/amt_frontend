import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import NoProfilePhoto from '../../assets/images/noprofilephoto.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const BASE_URL = 'http://127.0.0.1:8000/';

const RateBuyerScreen = ({ route, navigation }) => {
  const { buyerId, itemId } = route.params;
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    const fetchBuyerDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profiles/user/${buyerId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBuyer(data);
        } else {
          console.error('Failed to fetch buyer details');
        }
      } catch (error) {
        console.error('Error fetching buyer details:', error);
      }
    };

    fetchBuyerDetails();
  }, [buyerId, token]);

  const handleRatingPress = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rate-buyer-and-sold-item/${buyerId}/${itemId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
  
      if (response.ok) {
        navigation.navigate('Sold');  // Navigate to the SoldScreen
      } else {
        console.error('Failed to submit rating.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert("Error submitting rating. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Review</Text>
      <Text style={styles.subHeader}>How was your overall experience?</Text>

      {buyer && (
        <View style={styles.buyerContainer}>
          <Image
            source={buyer.profile_picture_url ? { uri: buyer.profile_picture_url } : NoProfilePhoto}
            style={styles.buyerImage}
          />
          <View style={styles.buyerDetails}>
            <Text style={styles.buyerName}>{buyer.username}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
                  <Icon
                    name="star"
                    size={30}
                    color={star <= rating ? '#364a54' : '#ccc'}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    <View style={styles.footer}>
      <TouchableOpacity style={styles.finishButton} onPress={handleSubmitRating}>
        <View style={styles.buttonSymbol}>
          <Text style={styles.symbolText}>{'>'}</Text>
        </View>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2efe9',
    justifyContent: 'flex-start',  // Align everything towards the top
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'rigsans-bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#364a54',
    marginBottom: 20,
    fontFamily: 'basicsans-regular',
  },
  buyerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buyerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ccc', // Placeholder background color
  },
  buyerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  buyerName: {
    fontSize: 18,
    color: '#364a54',
    fontFamily: 'basicsans-regular',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  finishButton: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#293e48',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  finishButtonText: {
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
});

export default RateBuyerScreen;

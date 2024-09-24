import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import NoProfilePhoto from '../../assets/images/noprofilephoto.png';
const BASE_URL = 'http://localhost:8000';

const SelectBuyerScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { token } = useAuth();
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items/${itemId}/interested-users/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInterestedUsers(data);
        } else {
          console.error('Failed to fetch interested users');
        }
      } catch (error) {
        console.error('Error fetching interested users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterestedUsers();
  }, [itemId, token]);

  const handleSelectBuyer = (buyerId) => {
    navigation.navigate('RateBuyer', { itemId, buyerId });
  };

  const handleSoldToSomeoneElse = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sold-item-to-someone-else/${itemId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
  
      if (response.ok) {
        navigation.navigate('Sold');  // Navigate to the SoldScreen
      } else {
        console.error('Failed to mark item as sold.');
      }
    } catch (error) {
      console.error('Error marking item as sold:', error);
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#364a54" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Review</Text>
      <Text style={styles.subHeader}>Congrats on selling your item! Please select your buyer to move forward.</Text>
      
      {interestedUsers.map((user) => (
        <TouchableOpacity key={user.id} style={styles.userButton} onPress={() => handleSelectBuyer(user.id)}>
          <Image
            source={user.profile_picture_url ? { uri: user.profile_picture_url } : NoProfilePhoto}
            style={styles.userImage}
            />
          <Text style={styles.userName}>{user.username}</Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.soldToSomeoneElseButton} onPress={handleSoldToSomeoneElse}>
        <View style={styles.buttonSymbol}>
          <Text style={styles.symbolText}>{'>'}</Text>
        </View>
        <Text style={styles.soldToSomeoneElseText}>Sold to someone else</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2efe9',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'rigsans-bold',
    marginBottom: 20,
},
  subHeader: {
    fontSize: 18,
    color: '#364a54',
    marginBottom: 20,
    fontFamily: 'basicsans-regular',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ccc', // Placeholder background color
  },
  userName: {
    fontSize: 18,
    color: '#364a54',
    fontFamily: 'basicsans-regular',
  },
  soldToSomeoneElseButton: {
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
  soldToSomeoneElseText: {
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

export default SelectBuyerScreen;

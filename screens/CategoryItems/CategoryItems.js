import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
const BASE_URL = 'http://localhost:8000';

const CategoryItems = ({ route, navigation }) => {
  const { categoryName, endpoint, zipCode, radius, searchQuery: initialSearchQuery } = route.params;
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
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
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryName, endpoint, searchQuery, zipCode, radius, token]);

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
      <TextInput
        style={styles.searchBar}
        placeholder="What are you looking for?"
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.categoryLocationContainer}>
        <Text style={styles.titleCategory}>{categoryName}</Text>
        <Text style={styles.locationInput}>{zipCode}</Text>
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
    marginTop: 15,
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  titleCategory: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default CategoryItems;

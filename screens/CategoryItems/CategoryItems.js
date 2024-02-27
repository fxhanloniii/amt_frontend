import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
const BASE_URL = 'http://3.101.60.200:8000';

const CategoryItems = ({ route, navigation }) => {
  const { categoryName, endpoint, location } = route.params;
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { user, token } = useAuth();
  const { searchQuery: initialSearchQuery } = route.params;
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  console.log(items)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let apiUrl = '';
        if (searchQuery) {
          apiUrl = `${BASE_URL}/items/?search=${encodeURIComponent(searchQuery)}`;
        } else if (endpoint) {
          // If endpoint is provided, use it
          apiUrl = endpoint;
        } else if (categoryName) {
          // If category name is provided, use it
          apiUrl = `${BASE_URL}/items/?category=${encodeURIComponent(categoryName)}`;
        } else {
          console.error('No endpoint or category name provided');
          return;
        }

        // Add location to the URL if it's provided
        if (location) {
          apiUrl += `&location=${encodeURIComponent(location)}`;
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
          setItems(itemsData);
          
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, [categoryName, endpoint, searchQuery, location, token]);

  const handleItemPress = (itemId) => {
    
    navigation.navigate('Item', { itemId });
  };

  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
  };

  const handleSearch = () => {
    navigation.navigate('Category', {
      searchQuery,
      location,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
      style={styles.searchBar}
      placeholder="What does your project need?"
      value={searchQuery}
      onChangeText={handleSearchQueryChange}
      onSubmitEditing={handleSearch}
    />
      <View style={styles.categoryLocationContainer}>
        <Text style={styles.titleCategory}>{categoryName}</Text>
        <Text style={styles.locationInput}>{location}</Text>
      </View>
      <View style={styles.horizontalLine} />
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.id }-${index}`}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => handleItemPress(item.id)}>
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.images[0]?.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <Text style={styles.itemName}>{item.title}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        numColumns={2}
      />
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
    backgroundColor: 'lightgray',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  itemName: {
    fontSize: 12,
    flex: 2,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
});

export default CategoryItems;

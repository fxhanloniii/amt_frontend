import { StyleSheet, Text, View, TextInput, ScrollView, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'


export default function Home({ navigation }) {
  const [viewAll, setViewAll] = useState(false);


  const renderCategory = (category) => (
    <TouchableOpacity 
      key={category} 
      style={styles.categoryButton} 
      onPress={() => navigation.navigate('Category', { categoryName: category })}
    >

      <Text style={styles.categoryButtonText}>{category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.searchBar}
        placeholder="What does your project need?" // do we change this?
      />
      <View style={styles.categoryLocationContainer}>
      <Text style={styles.titleTopCatergories}>Top Categories</Text>
      <Text style={styles.locationInput}>Location</Text>
      </View>
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        {['Appliances', 'Concrete & Brick', 'Electrical', 'Hardware', 'Lumber', 'Paint', 'Tile & Masonry', 'Tools'].map(renderCategory)}
        
        {viewAll && ['Category 9', 'Category 10'].map(renderCategory)}

        <TouchableOpacity style={styles.viewAllButton} onPress={() => setViewAll(!viewAll)}>
          <Text style={styles.viewAllButtonText}>View All Categories</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
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
  },
    titleTopCatergories: {
      fontSize: 18, 
      fontWeight: 'bold',
  },
  categoryButton: {
    backgroundColor: '#fcfbfa',
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 50,
    margin: 5,
    width: '90%',  // Use 90% of the parent width
    alignSelf: 'center',  // This will center the button in the ScrollView
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#293e49',
    borderWidth: 1,
    borderStyle: 'solid',
},
  categoryButtonText: {
    color: '#293e49',
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: '#293e49',
    paddingVertical: 5,  // Adjust padding to vertically center the text
    paddingHorizontal: 0,  // No horizontal padding to utilize full width
    borderRadius: 50,
    margin: 10,
    width: '90%',  // Use 90% of the parent width
    height: 35,
    justifyContent: 'center',  // Vertically center the text
    alignItems: 'center',
    alignSelf: 'center',
  },
  viewAllButtonText: {
    color: 'white',
    fontWeight: 'bold',

  },
});
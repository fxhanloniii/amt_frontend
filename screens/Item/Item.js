import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';

const Item = ({ route, navigation }) => {
  const [item, setItem] = useState(null);
  const [inputMessage, setInputMessage] = useState('Still Available?');
  const { user, token } = useAuth();
  
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const itemId = route.params.itemId;
        const response = await fetch(`http://127.0.0.1:8000/items/${itemId}/`);

        if (response.ok) {
          const itemData = await response.json();
          setItem(itemData);
        } else {
          console.error('Failed to fetch item data');
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchItemData();
  }, [route.params.itemId]);

  const handleMessageSeller = async () => {

    if (!inputMessage.trim()) {
      console.error('Input message is empty');
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/start-conversation/${item.id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
            initialMessage: inputMessage, 
      
        }),
        
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        navigation.navigate('Message', { conversationId: data.conversation_id });
    } else {
        console.error('Failed to start conversation');
    }
};


  if (!item) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isCurrentUserOwner = user && user.pk === item.seller;

  return (
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      {/* Image Placeholder */}
      <View style={styles.imageContainer}></View>

      {/* Item Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Price */}
      <Text style={styles.price}>${item.price}</Text>

      {/* Description */}
      <Text style={styles.description}>Description:</Text>
      <Text style={styles.description}>{item.description}</Text>

      {/* Message Box (Conditionally render based on ownership) */}
      {!isCurrentUserOwner && (
      <View style={styles.messageBox}>
        <TextInput
          style={styles.messageInput}
          placeholder="Still available?"
          editable={true}
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.messageButton} onPress={handleMessageSeller}>
          <Text style={styles.messageButtonText}>Message Seller</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2efe9',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, 
    borderWidth: 1,
    borderColor: 'black', 
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  messageBox: {
    borderWidth: 1,
    borderColor: 'black', 
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'black', 
  },
  messageButton: {
    backgroundColor: 'blue', 
    padding: 8,
    borderRadius: 4,
  },
  messageButtonText: {
    color: 'white', 
    textAlign: 'center',
  },
});

export default Item;
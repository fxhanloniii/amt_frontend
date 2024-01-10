import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 

const Message = ({ route }) => {
    const { conversationId, itemDetails } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const webSocket = useRef(null);
    const { token, user } = useAuth();

    useEffect(() => {

        const fetchMessages = async () => {
            const response = await fetch(`http://127.0.0.1:8000/conversations/${conversationId}/messages/`, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data); // Assuming your backend returns an array of messages
                console.log(data)
            } else {
                console.error('Failed to fetch messages');
            }
        };
        
        fetchMessages();

        // connect to websocket server 
        webSocket.current = new WebSocket(`ws://127.0.0.1:8001/ws/chat/${conversationId}/`);

        webSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, data.message]);
        };

        webSocket.current.onclose = () => {
            console.log('WebSocket closed');
        };

        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [conversationId]);

    const sendMessage = () => {
        if (webSocket.current && newMessage.trim()) {
            // Send message to WebSocket
            webSocket.current.send(JSON.stringify({ message: newMessage }));

            // Update state with the new message including sender info
            setMessages(prevMessages => [...prevMessages, {
                text: newMessage, 
                sender: user.username  
            }]);
            setNewMessage('');
        }

        webSocket.current.onmessage = (e) => {
            const incomingMessage = JSON.parse(e.data).message;
        
            // Check to avoid duplicates
            if (!messages.some(msg => msg.text === incomingMessage.text && msg.sender.username === incomingMessage.sender.username)) {
                setMessages(prevMessages => [...prevMessages, incomingMessage]);
            };
        };
    };

    const renderItem = ({ item }) => {
        const isCurrentUser = item.sender === user.username;
        return (
            <View style={[styles.messageBubble, isCurrentUser ? styles.rightAlign : styles.leftAlign]}>
                {!isCurrentUser && (
                    <Image
                        source={{ uri: item.senderProfileImage || noProfilePhoto }}
                        style={styles.profileImage}
                    />
                )}
                <View>
                    <Text style={styles.senderName}>{item.sender}</Text>
                    <Text>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Item Details Section */}
            {itemDetails && (
                <View style={styles.itemDetails}>
                    <Image
                        source={{ uri: itemDetails.image_url || 'path_to_grey_square_image' }}
                        style={styles.itemImage}
                    />
                    <View>
                        <Text>{itemDetails.title}</Text>
                        <Text>Seller: {itemDetails.seller.first_name}</Text>
                        <Text>${itemDetails.price}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ItemScreen', { itemId: itemDetails.id })}>
                            <Text style={styles.viewListingButton}>View Full Listing</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <View style={styles.divider} />
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type your message..."
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5,
      paddingBottom: 16,
      backgroundColor: '#f2efe9',
      marginTop: 10,
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    itemImage: {
        width: 100,
        height: 100,
        backgroundColor: 'grey',
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    messageBubble: {
        flexDirection: 'row',
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    rightAlign: {
        alignSelf: 'flex-end',
    },
    leftAlign: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontWeight: 'bold',
    },
    viewListingButton: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },

});
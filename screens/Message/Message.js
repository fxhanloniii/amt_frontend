import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 
const BASE_URL = 'http://13.57.40.111:8000';

const Message = ({ route, navigation }) => {
    const { conversationId, itemDetails } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const webSocket = useRef(null);
    const { token, user } = useAuth();
    const [profilePicture, setProfilePicture] = useState(noProfilePhoto);
    const [userProfile, setUserProfile] = useState(null);
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    console.log(itemDetails)
    useEffect(() => {

        const fetchMessages = async () => {
            const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages/`, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data); 
                console.log(data)
            } else {
                console.error('Failed to fetch messages');
            }
        };

        
        
        fetchMessages();
        fetchUserProfile();
        // connect to websocket server 
        webSocket.current = new WebSocket(`ws://13.57.40.111:8001/ws/chat/${conversationId}/`);

        webSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, data.message]);
        };

        webSocket.current.onclose = () => {
                    };

        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [conversationId]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${BASE_URL}/profiles/user/${user.pk}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const userProfileData = await response.json();
            setUserProfile(userProfileData);
    
            if (userProfileData.profile_picture_url) {
              setProfilePicture({ uri: userProfileData.profile_picture_url });
                      } else {
              setProfilePicture(noProfilePhoto);
            }
            setIsCurrentUserProfile(userProfileData.user === user.id);
          } else {
            console.error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

    const sendMessage = async () => {
        if (webSocket.current && newMessage.trim()) {
            // Send message to WebSocket
            webSocket.current.send(JSON.stringify({ message: newMessage }));
    
            const messageData = {
                conversation: conversationId,
                sender: user.id, // Adjust based on your user object
                text: newMessage,
            };
    
            try {
                const response = await fetch(`${BASE_URL}/save-message/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify(messageData),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to save message');
                }
    
                // Update state with the new message including sender info
                setMessages(prevMessages => [...prevMessages, {
                    text: newMessage, 
                    sender: user.pk,
                    sender_profile: { 
                        first_name: user.first_name,
                        profile_picture_url: userProfile ? userProfile.profile_picture_url : noProfilePhoto
                    }
                }]);
                setNewMessage('');
                console.log(user)
    
            } catch (error) {
                console.error('Error sending message:', error);
            }
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

        const isCurrentUser = item.sender === user.pk;
        const profileImage = item.sender_profile ? item.sender_profile.profile_picture_url : noProfilePhoto;
        const senderName = item.sender_profile ? item.sender_profile.first_name : item.sender;
        
        return (
            <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
                
                    <Image
                        source={{ uri: profileImage || noProfilePhoto }}
                        style={styles.profileImage}
                    />
                
                <View>
                <View style={styles.messageContent}>
                <Text style={[
                        styles.senderName,
                        isCurrentUser ? styles.currentUserText : styles.otherUserText
                    ]}>{senderName}</Text>
                    <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>{item.text}</Text>
                </View>
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
                source={{ uri: itemDetails.images[0].image }}
                style={styles.itemImage}
                />
                <View style={styles.itemDetailsContainer}> 
                <View style={styles.itemDetailText}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Title:</Text>
                    <Text>{itemDetails.title}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Seller:</Text>
                    <Text>{itemDetails.seller_profile.first_name}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text>${itemDetails.price}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Item', { itemId: itemDetails.id })}>
                    <Text style={styles.viewListingButton}>View Full Listing</Text>
                </TouchableOpacity>
                </View>
                </View>
            </View>
            )}
            <View style={styles.divider} />
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.messageBoxContainer}>
                <TextInput
                    style={styles.messageInput}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type your message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
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
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2efe9',
        height: 200,
    },
    itemDetailsContainer: {
        marginTop: 20,
    },
    itemDetailText: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        
    },
    itemImage: {
        width: 150,
        height: 150,
        backgroundColor: 'grey',
        borderRadius: 5,
    },
    itemDetailText: {
        flex: 1,
        paddingHorizontal: 10,
      },
      detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, 
      },
      detailLabel: {
        fontWeight: 'bold',
        marginRight: 5, 
      },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    messageBubble: {
        flexDirection: 'row',
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '70%',
    },
    currentUserBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#364a54',
    },

    otherUserBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },

    currentUserText: {
        color: 'white',
    },

    otherUserText: {
        color: '#364a54',
    },

    senderName: {
        fontWeight: 'bold',
    },
    messageContent: {
        marginLeft: 8, 
    },
    viewListingButton: {
        backgroundColor: '#364a54', 
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10, 
      },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 5,
    },
    messageBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    messageInput: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#364a54',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

});
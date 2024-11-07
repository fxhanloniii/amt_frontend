import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useAuth } from '../../AuthContext/AuthContext';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 
const BASE_URL = "http://3.101.60.200:8080";

const Message = ({ route, navigation }) => {
    const { conversationId, itemDetails } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const webSocket = useRef(null);
    const { token, user } = useAuth();
    const [profilePicture, setProfilePicture] = useState(noProfilePhoto);
    const [userProfile, setUserProfile] = useState(null);
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const flatListRef = useRef(null);
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
        webSocket.current = new WebSocket(`${BASE_URL}/ws/chat/${conversationId}/`);

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
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.sender })}>
                    <Image
                        source={{ uri: profileImage || noProfilePhoto }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <View>
                <View style={{ flex: 1 }}>
                <View style={styles.messageContent}>
                    <Text style={[
                        styles.senderName,
                        isCurrentUser ? styles.currentUserTextName : styles.otherUserTextName
                        ]}>{senderName}
                    </Text>
                    <View style={{ flex: 1 }}>
                    <View style={styles.messageText}>
                        <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>{item.text}</Text>
                    </View>
                    </View>
                </View>
                </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            
            {/* Header with Back Button and Inbox Text */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Inbox</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'< Back'}</Text>
                </TouchableOpacity>
                
            </View>

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
                <TouchableOpacity 
                    style={styles.viewListingButton} 
                    onPress={() => navigation.navigate('Item', { itemId: itemDetails.id })}
                >
                    <View style={styles.iconContainer}>
                        <Entypo name="dots-three-horizontal" size={12} color="#293e48" />
                    </View>
                    <Text style={styles.buttonText}>View Full Listing</Text>
                </TouchableOpacity>
                </View>
                </View>
            </View>
            )}
            <View style={styles.divider} />
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
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
        </KeyboardAvoidingView>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingBottom: 16,
      backgroundColor: '#f2efe9',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    backButton: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'rigsans-bold',
        paddingRight: 10,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'rigsans-bold',
        paddingLeft: 10,
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
    senderName: {
        fontFamily: 'rigsans-bold', 
    },
    currentUserTextName: {
        color: 'white',
    },
    otherUserTextName: {
        color: '#364a54',
    },
    messageBubble: {
        flexDirection: 'row',
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: 'auto',
        height: 'auto',
    },
    currentUserBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#364a54',
        width: '80%',
        flexDirection: 'row',
    },

    otherUserBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        width: '80%',
        flexDirection: 'row',
        
    },
    messageContent: {
        marginLeft: 8,
        flex: 1,
    },
    messageText: {
        flex: 1,
    },
    currentUserText: {
        color: 'white',
        fontFamily: 'basicsans-regular',
        flex: 1,
        flexWrap: 'wrap',
    },

    otherUserText: {
        color: '#364a54',
        fontFamily: 'basicsans-regular',
        flex: 1,
        flexWrap: 'wrap',
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
    viewListingButton: {
        backgroundColor: '#293e48',
        borderRadius: 25,
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        overflow: 'hidden',
        width: 185,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16, 
        left: -12,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'basicsans-regular',
        paddingRight: 16,
    },
});
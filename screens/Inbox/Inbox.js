import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import noProfilePhoto from '../../assets/images/noprofilephoto.png'; 
import { useAuth } from '../../AuthContext/AuthContext';
import Layout from '../../components/Layout';
import inboxIcon from '../../assets/images/inbox.png';

const BASE_URL = "http://3.101.60.200:8080";

const Inbox = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const { user, token } = useAuth();

    

    useEffect(() => {
        const fetchConversations = async () => {
            const response = await fetch(`${BASE_URL}/conversations/`, {
                headers: { Authorization: `Token ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data);
                console.log(data)
            } else {
                console.error('Failed to fetch conversations');
            }
        };

        fetchConversations();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
    

    const renderItem = ({ item }) => {

        const itemDetails = item.item_details;
        const otherUserDetails = item.other_user_details;
        const lastMessage = item.last_message;
        const lastMessageText = lastMessage ? truncateText(lastMessage.text, 25) : 'No messages yet';

        const defaultProfileImage = noProfilePhoto;
        const itemImageAvailable = itemDetails.images && itemDetails.images.length > 0;
        const itemImage = itemImageAvailable ? { uri: itemDetails.images[0].image } : null;

        
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Message', { conversationId: item.id, itemDetails: item.item_details })}>
            <View style={styles.itemContainer}>
                <Image
                    source={{ uri: otherUserDetails.profile_picture_url || defaultProfileImage }}
                    style={styles.sellerImage}
                />
                <View style={styles.messageContainer}>
                    <Text style={styles.username}>{otherUserDetails.first_name || 'User'}</Text>
                    <Text style={styles.lastMessageText}>{lastMessageText}</Text>
                </View>
                <View style={itemImageAvailable ? styles.itemImage : styles.defaultItemImage}>
                    {itemImage && <Image source={itemImage} style={styles.fullSizeImage} />}
                </View>
                <View style={styles.arrowContainer}>
                    <Text style={styles.arrowText}>{'>'}</Text>
                </View>
            </View>
        </TouchableOpacity>
        );
    };

    return (
        
        <View style={styles.container}>
        <Text style={styles.header}>Inbox</Text>
        {conversations.length > 0 ? (
            <FlatList
                contentContainerStyle={styles.listContentContainer}
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        ) : (
            <View style={styles.emptyContainer}>
                <Image source={inboxIcon} style={styles.inboxIcon} />
            </View>
        )}
        </View>
        
    );


};

export default Inbox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2efe9', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    listContentContainer: {
        width: '100%',
        alignItems: 'center', 
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius:10,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'white', 
        marginBottom: 10,

    },
    sellerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    messageContainer: {
        flex: 1,
        marginLeft: 10,
    },
    username: {
        fontFamily: 'rigsans-bold',
    },
    itemImage: {
        width: 50,
        height: 50,
    },
    defaultItemImage: {
        width: 50,
        height: 50,
        backgroundColor: '#cccccc', // Grey background
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullSizeImage: {
        width: '100%',
        height: '100%',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inboxIcon: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    lastMessageText: {
        fontFamily: 'basicsans-regular',
    },
    arrowContainer: {
        paddingLeft: 8, // 5px padding on the left and right
        justifyContent: 'center',
    },
    arrowText: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'rigsans-bold',
    },
});
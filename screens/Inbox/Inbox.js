import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { useAuth } from '../../AuthContext/AuthContext';

const Inbox = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const { user, token } = useAuth();

    

    useEffect(() => {
        const fetchConversations = async () => {
            const response = await fetch('http://127.0.0.1:8000/conversations/', {
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

    

    const renderItem = ({ item }) => {

        const itemDetails = item.item_details;
        const lastMessage = item.last_message;
        const sellerDetails = item.seller_details;
        return (
        <TouchableOpacity onPress={() => navigation.navigate('Message', { conversationId: item.id })}>
            <View style={styles.itemContainer}>
                <Image
                    source={{ uri: item.sellerImage }} // Replace with actual image URL
                    style={styles.sellerImage}
                />
                <View style={styles.messageContainer}>
                    <Text style={styles.username}>{item.sellerUsername}</Text>
                    <Text>{item.lastMessage}</Text>
                </View>
                <Image
                    source={{ uri: item.itemImage }} // Replace with actual image URL
                    style={styles.itemImage}
                />
            </View>
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Inbox</Text>
            <FlatList
                contentContainerStyle={styles.listContentContainer}
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
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
        marginTop: 10,
        marginBottom: 10,
    },
    listContentContainer: {
        width: '90%', 
        alignItems: 'center', 
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width:'90%',
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
        fontWeight: 'bold',
    },
    itemImage: {
        width: 50,
        height: 50,
    },
});
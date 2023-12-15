import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { useAuth } from '../../AuthContext/AuthContext';

const Inbox = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const { user, token } = useAuth();

    useEffect(() => {
        // Connect to the WebSocket server
        const socket = io('/127.0.0.1:8002/ws/some_path/');
    
        // Fetch conversations from your Django backend
        fetch('http://127.0.0.1:8000/conversations/', {
            headers: {
                Authorization: `Token ${token}`,
            },
        }) 
            .then((response) => response.json())
            .then((data) => {
                console.log('Response content:', data);
                const jsonData = JSON.parse(data);
                setConversations(jsonData);
            })
            .catch((error) => {
                console.error('Error fetching conversations:', error);
            });
    
        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Message', { conversationId: item.id })}>
            <View>
                <Text>{item.username}</Text>
                {/* Add more information ie item name, username */}
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text>Inbox</Text>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );


};

export default Inbox;
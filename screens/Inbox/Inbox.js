import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const Inbox = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        // connect to the websocket server
        const socket = io('BACKEND-URL');

        // listen for incoming messages or events
        socket.on('newMessage', (message) => {
            // handle new messages and update state
            // filter and update the specific conversation
        });

        // clean up the socket connection on component unmount
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
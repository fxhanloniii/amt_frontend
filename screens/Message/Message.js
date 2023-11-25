import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import io from 'socket.io-client';

const Message = ({ route }) => {
    const { conversationId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // connect to websocket server
        const socket = io('BACKEND-URL');

        // join specific conversation room
        socket.emit('joinRoom', conversationId);

        // listen for incoming messages or events
        socket.on('newMessage', (message) => {
            // handle new messages and update state
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // clean up the socket connection on component unmount
        return () => {
            socket.emit('leaveRoom', conversationId);
            socket.disconnect();
        };
    }, [conversationId]);

    const sendMessage = () => {
        // send the new message to the backend
        // emit the message event to the server
        // update the local optimistically
    };

    const renderItem = ({ item }) => (
        <View>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
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
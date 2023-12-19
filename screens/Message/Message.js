import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import io from 'socket.io-client';

const Message = ({ route }) => {
    const { conversationId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const webSocket = useRef(null);

    useEffect(() => {
        // connect to websocket server
        webSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/conversations/${conversationId}/`);

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
            webSocket.current.send(JSON.stringify({ message: newMessage }));
            setNewMessage('');
        }
    };

    const renderItem = ({ item}) => <Text>{item}</Text>

    return (
        <View>
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
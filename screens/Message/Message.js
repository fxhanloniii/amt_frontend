import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';

const Message = ({ route }) => {
    const { conversationId } = route.params;
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

    const renderItem = ({ item }) => (
        <View>
            <Text>From: {item.sender}</Text>
            <Text>Message: {item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
    },

});
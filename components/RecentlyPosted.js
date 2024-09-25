import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../AuthContext/AuthContext';
const BASE_URL = 'http://127.0.0.1:8000/';
import { useIsFocused } from '@react-navigation/native';
const RecentlyPosted = ({ navigation }) => {
    const { token } = useAuth();
    const [recentlyPosted, setRecentlyPosted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(Array(10).fill(false));
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchRecentlyPosted();
        }  
    },[isFocused, token]);

    const fetchRecentlyPosted = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/recent-items/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                  },
            },);
            const data = await response.json();
            setRecentlyPosted(data);
            setLoading(false);
            } catch (error) {
                console.error('Error fetching recent items:', error);
            }
    };

    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recently Listed</Text>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#364a54" />
                </View>
                ) : recentlyPosted && recentlyPosted.length > 0 ? (
            <View style={styles.recentlyPostedContainer}>
                {recentlyPosted.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('Item', { itemId: item.id})}>
                        <View style={styles.itemContainer}>
                        <Image source={{ uri: item.images[0]?.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemPrice}>{item.price === 0 ? 'FREE' : `$${item.price}`}</Text>
                            <Text style={styles.recentlyPostedTitle} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                        </View>
                        </View>
                        
                    </TouchableOpacity>
                ))}
            </View>
                ): (
                    <Text>No items found</Text>
                )}
        </View>
    )
}

export default RecentlyPosted;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontFamily: 'rigsans-bold',
        marginBottom: 10,
    },
    itemContainer: {
        width: 165,
        marginBottom: 20,
    },
    itemImage: {
        width: 165,
        height: 165,
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    recentlyPostedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    recentlyPostedTitle: {
        fontSize: 14,
        fontFamily: 'rigsans-regular',
        width: 165,
        overflow: 'hidden',
        numberOfLines: 1,   // Limits to one line
        ellipsizeMode: 'tail',
    },
    itemDetails: {
        width: 165,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'rigsans-bold',
        marginRight: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
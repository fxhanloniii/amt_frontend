import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useAuth } from '../AuthContext/AuthContext';
const BASE_URL = 'http://3.101.60.200:8000';

const RecentlyPosted = ({ navigation }) => {
    const { token } = useAuth();
    const [recentlyPosted, setRecentlyPosted] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentlyPosted();
    },[]);

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
            console.log('recentlyPosted:', recentlyPosted);
            console.log('Images for one of the items:', recentlyPosted[0].images);
            setLoading(false);
            } catch (error) {
                console.error('Error fetching recent items:', error);
            }
    };

    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recently Listed</Text>
            {loading ? (
                    <Text>Loading...</Text>
                ) : (
            <View style={styles.recentlyPostedContainer}>
                {recentlyPosted.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('Item', { itemId: item.id})}>
                        <View style={styles.itemContainer}>
                        <Image source={{ uri: item.images[0]?.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemPrice}>${item.price}</Text>
                            <Text style={styles.recentlyPostedTitle}>{item.title}</Text>
                        </View>
                        </View>
                        
                    </TouchableOpacity>
                ))}
            </View>
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
        fontFamily: 'RigSans-Bold',
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
        backgroundColor: 'lightgray',
    },
    recentlyPostedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    itemDetails: {
        width: 165,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'RigSans-Bold',
    },
})
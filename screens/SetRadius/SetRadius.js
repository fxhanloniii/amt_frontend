import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';  // Import Slider from the community module
import { useAuth } from '../../AuthContext/AuthContext';

const BASE_URL = 'http://127.0.0.1:8000/';

const SetRadius = ({ navigation, route }) => {
    const { zipCode, token, userId } = route.params;
    const [radius, setRadius] = useState(50); // Default radius is 50 miles
    const { user } = useAuth();
    const [region, setRegion] = useState({
        latitude: 37.78825,  // Default latitude
        longitude: -122.4324,  // Default longitude
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        // Geocode the zip code to get the latitude and longitude
        const fetchCoordinates = async () => {
            try {
                const response = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
                const data = await response.json();
                const { 'post code': postCode, places } = data;
                if (places.length > 0) {
                    const place = places[0];
                    setRegion({
                        latitude: parseFloat(place.latitude),
                        longitude: parseFloat(place.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            } catch (error) {
                console.error('Error fetching coordinates:', error);
            }
        };

        fetchCoordinates();
    }, [zipCode]);

    const saveRadius = async () => {
        try {
            const response = await fetch(`${BASE_URL}/profiles/user/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delivery_radius: radius }),
            });

            if (response.ok) {
                navigation.navigate('ThankYou');  // Navigate to ThankYou screen
            } else {
                console.error('Failed to save radius');
            }
        } catch (error) {
            console.error('Error saving radius:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.instructionText}>Your zip code is {zipCode}. Please choose your radius for viewing available products.</Text>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
            >
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                <Circle
                    center={{ latitude: region.latitude, longitude: region.longitude }}
                    radius={radius * 1609.34}  // Convert miles to meters
                    strokeWidth={2}
                    strokeColor="rgba(0, 122, 255, 0.5)"
                    fillColor="rgba(0, 122, 255, 0.1)"
                />
            </MapView>
            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={radius}
                    onValueChange={setRadius}
                />
                <Text style={styles.radiusText}>{radius} miles</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={saveRadius}>
                <Text style={styles.buttonText}>Save Radius</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2efe9',
    },
    instructionText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
        fontFamily: 'basicsans-regular',
        color: '#293e48',
    },
    map: {
        width: '90%',
        height: '50%',
        marginBottom: 20,
    },
    sliderContainer: {
        width: '80%',
        alignItems: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    radiusText: {
        fontSize: 12,
        marginTop: 10,
        fontFamily: 'basicsans-regular',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#293e48',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'basicsans-regular',
    },
});

export default SetRadius;

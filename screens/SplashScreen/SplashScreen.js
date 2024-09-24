import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Animated, Easing, Dimensions } from 'react-native';
import { useAuth } from '../../AuthContext/AuthContext';
import Logo from '../../assets/images/rubblewhitelogo.png';
import LogIn2 from '../LogIn/LogIn2';


const { height: windowHeight } = Dimensions.get('window');
const logoSlideUpDistance = windowHeight / 16;
const BASE_URL = 'http://localhost:8000';

export default function SplashScreen({ navigation }) {
    const { isSignedIn } = useAuth();
    const [fadeIn] = useState(new Animated.Value(0));
    const [fadeOut] = useState(new Animated.Value(1));
    const [slideUp] = useState(new Animated.Value(0));
    const fadeInDuration = 1000;
    const fadeOutDuration = 1000;
    const slideUpDuration = 1000;

    useEffect(() => {

        const fetchGlobalItemsSold = async () => {
            try {
              const response = await fetch(`${BASE_URL}/global-items-sold/`);
              const data = await response.json();
              setGlobalItemsSold(data.items_saved_from_landfill);
            } catch (error) {
              console.error('Error fetching global items sold:', error);
            }
          };
        
          fetchGlobalItemsSold();

        if (!isSignedIn) {
            const fadeInAnimation = Animated.timing(fadeIn, {
                toValue: 1,
                duration: fadeInDuration,
                useNativeDriver: true,
            });

            const fadeOutAnimation = Animated.timing(fadeOut, {
                toValue: 0,
                duration: fadeOutDuration,
                useNativeDriver: true,
            });

            const slideUpAnimation = Animated.timing(slideUp, {
                toValue: -logoSlideUpDistance,
                duration: slideUpDuration,
                easing: Easing.ease,
                useNativeDriver: true,
            });

            // Sequence animations
            Animated.sequence([
                fadeOutAnimation,
                slideUpAnimation,
                fadeInAnimation,
            ]).start();
        } else {
            // If user is signed in, simply fade out the screen
            Animated.timing(fadeOut, {
                toValue: 0,
                duration: fadeOutDuration,
                useNativeDriver: true,
            }).start(() => {
                // Navigate to the Home page after fade out animation completes
                navigation.navigate('Home');
            });
        }
    }, [isSignedIn]);
    
    

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.title, { opacity: fadeOut }]}>Welcome To</Animated.Text>
            <Animated.View style={[styles.logoContainer, { transform: [{ translateY: slideUp }] }]}>
                <Image source={Logo} style={styles.logo} />
            </Animated.View>
            <Animated.View style={[styles.login, { opacity: fadeIn }]}>
                    <LogIn2 />
            </Animated.View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#9e3f19',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'basicsans-regular',

    },
    logoContainer: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: '75%',
        height: 100,
        objectFit: 'contain',
    },
    login: {
        width: '100%',
        marginTop: -20,
    },
})
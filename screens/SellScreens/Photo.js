import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoPage({ route, navigation }) {
    const { category, title, description, price, isForSale, isPriceNegotiable } = route.params;
    const [selectedImages, setSelectedImages] = useState([]);

    // Function to open the image picker
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Allow multiple photo selection
            quality: 1,
        });

        if (!result.canceled) {
            const selectedAssets = result.assets || [];
            const newImages = selectedAssets.map(asset => asset.uri);
            setSelectedImages([...selectedImages, ...newImages]);
        }
    };

    // Function to open the camera for taking a photo
    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    // Function to render each selected photo
    const renderPhoto = ({ item }) => (
        <Image source={{ uri: item }} style={styles.photo} />
    );

    // Function to navigate to the review page
    const goToReview = () => {
        navigation.navigate('Review', {
            selectedImages,
            category,
            title,
            description,
            price,
            isForSale,
            isPriceNegotiable,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Sell an Item</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'< Back'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.photoOptions}>
                <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
                    <Image source={require('../../assets/images/camera.png')} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={pickImage}
                    style={[
                        styles.photoButton,
                        selectedImages.length >= 10 && { opacity: 0.5, backgroundColor: 'gray' },
                    ]}
                    disabled={selectedImages.length >= 10}
                >
                    <Image source={require('../../assets/images/image.png')} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>
                        {selectedImages.length > 0 ? "Add Another Photo" : "Select a Photo"}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.instructionText}>
                    Add your cover photo first. Then, add up to 10 photos
                </Text>
            </View>

            <View style={styles.photoGrid}>
                <FlatList
                    data={selectedImages}
                    renderItem={renderPhoto}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                />
            </View>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarStep, styles.activeStep, styles.roundedLeft]} />
                <View style={[styles.progressBarStep, styles.activeStep]} />
                <View style={[styles.progressBarStep, styles.roundedRight]} />
            </View>
            <View style={styles.progressBarLabels}>
                <Text style={[styles.progressLabel, styles.alignLeft]}>Post</Text>
                <Text style={[styles.progressLabel, styles.alignCenter]}>Photos</Text>
                <Text style={[styles.progressLabel, styles.alignRight]}>Finish</Text>
            </View>
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.nextButton} onPress={goToReview}>
                    <View style={styles.buttonSymbol}>
                        <Text style={styles.symbolText}>{'>'}</Text>
                    </View>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#f2efe9',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        fontFamily: 'rigsans-bold',
    },
    backButton: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'rigsans-bold',
    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    progressBarStep: {
        flex: 1,
        height: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
        borderRadius: 2,
    },
    activeStep: {
        backgroundColor: '#293e48',
    },
    roundedLeft: {
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
    },
    roundedRight: {
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    progressBarLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 4,
    },
    progressLabel: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'basicsans-regularit',
        marginBottom: 10,
    },
    alignLeft: {
        textAlign: 'left',
        flex: 1,
    },
    alignCenter: {
        textAlign: 'center',
        flex: 1,
    },
    alignRight: {
        textAlign: 'right',
        flex: 1,
    },
    photoOptions: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'grey',
        width: '94%',
        backgroundColor: '#fcfbfa',
        marginVertical: 5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
        position: 'absolute',
        left: 15,
        color: '#293e48',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'basicsans-regular',
        textAlign: 'center',
        flex: 1,
        color: '#293e48',
    },
    photoGrid: {
        flex: 1,
        padding: 2,
        alignItems: 'center',
    },
    photo: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        margin: 5,
    },
    instructionText: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'basicsans-regularit',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    nextButton: {
        flexDirection: 'row',
        padding: 4,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#293e48',
        width: '90%',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'basicsans-regular',
        flex: 1,
        textAlign: 'center',
        marginLeft: -10,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'basicsans-regular',
    },
    buttonSymbol: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    symbolText: {
        color: '#293e48',
        fontSize: 28,
        fontFamily: 'basicsans-regular',
        alignSelf: 'center',
        lineHeight: 28,
    },
});

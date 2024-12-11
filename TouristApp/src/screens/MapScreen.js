import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import axios from 'axios';
import { isPointWithinRadius } from 'geolib';
import { FontAwesome } from '@expo/vector-icons'; // Necesario para las estrellas
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.82:3000/poi';

const MapScreen = () => {
    const [points, setPoints] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeModal, setActiveModal] = useState(false);
    const [modalContent, setModalContent] = useState('main'); // 'main', 'info', 'distance'
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [distanceFilter, setDistanceFilter] = useState('');
    const [showCircle, setShowCircle] = useState(false);
    const [originalPoints, setOriginalPoints] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    alert('Tu sesión ha expirado, por favor inicia sesión nuevamente.');
                    navigation.navigate('Login');
                } else {
                    console.log('Token obtenido correctamente:', token);
                }
            } catch (error) {
                console.error('Error obteniendo el token:', error);
            }
        };

        fetchToken();
        fetchPoints(); // Si no depende del token, puede ejecutarse sin problemas
    }, [selectedType]);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = selectedType === 'all' ? {} : { type: selectedType };
            const response = await axios.get(API_URL, { params });
            setPoints(response.data);
            setOriginalPoints(response.data); // Guarda los puntos originales
        } catch (error) {
            console.error('Error fetching points of interest:', error);
            setError('Error loading points of interest');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkerPress = (point) => {
        setSelectedPoint(point);
        setModalContent('main');
        setActiveModal(true);
    };

    const handleInformationPress = () => {
        setModalContent('info');
    };

    const handleDistanceFilterPress = () => {
        setModalContent('distance');
    };

    const handleReviewPress = () => {
        setModalContent('review');
    };

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('Token en MapScreen:', token);
            return token || '';
        } catch (error) {
            console.error('Error obteniendo el token:', error);
            return '';
        }
    };


    const submitReview = async () => {
        const token = await getToken(); // Obtén el token del almacenamiento
        if (!token) {
            alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
            navigation.navigate('Login');
            return;
        }

        try {
            const response = await axios.post(
                `http://192.168.1.82:3000/review/points/${selectedPoint?.id}/reviews`, // Cambia la URL al prefijo correcto
                { rating, comment },
                {
                    headers: { 'x-access-token': token },
                }
            );
            alert('Reseña enviada con éxito');
            setActiveModal(false); // Cierra el modal
        } catch (error) {
            console.error('Error al enviar la reseña:', error.response?.data || error.message);
            alert('Error al enviar la reseña. Intenta nuevamente.');
        }
    };

    const applyDistanceFilter = () => {
        if (selectedPoint && distanceFilter) {
            const filteredPoints = points.filter(point =>
                isPointWithinRadius(
                    { latitude: point.latitude, longitude: point.longitude },
                    { latitude: selectedPoint.latitude, longitude: selectedPoint.longitude },
                    Number(distanceFilter)
                )
            );
            setPoints(filteredPoints);
        }
        setShowCircle(true);
        setActiveModal(false); // Cierra el modal
    };

    const resetFilter = () => {
        setPoints(originalPoints); // Restaura los puntos originales
        setShowCircle(false);
    };

    const closeModal = () => {
        setActiveModal(false);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                contentContainerStyle={styles.filterContainer}
                style={styles.scrollView}
                showsHorizontalScrollIndicator={false}
            >
                {['all', 'museum', 'park', 'historic_site', 'restaurant', 'other'].map(type => (
                    <TouchableOpacity key={type} style={styles.filterButton} onPress={() => setSelectedType(type)}>
                        <Text style={styles.filterText}>{type.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.filterButton, styles.resetButton]} onPress={resetFilter}>
                    <Text style={styles.filterText}>QUITAR FILTRO</Text>
                </TouchableOpacity>
            </ScrollView>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -35.423244,
                    longitude: -71.648480,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {points.map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                        title={point.name}
                        onPress={() => handleMarkerPress(point)}
                    />
                ))}
                {showCircle && selectedPoint && (
                    <Circle
                        center={{ latitude: selectedPoint.latitude, longitude: selectedPoint.longitude }}
                        radius={Number(distanceFilter)}
                        fillColor="rgba(135, 206, 250, 0.5)"
                        strokeColor="rgba(0, 0, 255, 0.1)"
                    />
                )}
            </MapView>

            {/* Main Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={activeModal}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {modalContent === 'main' ? (
                            <>
                                <Text style={styles.modalTitle}>{selectedPoint ? selectedPoint.name : 'Loading...'}</Text>
                                <TouchableOpacity style={styles.button} onPress={handleInformationPress}>
                                    <Text style={styles.buttonText}>Información</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleDistanceFilterPress}>
                                    <Text style={styles.buttonText}>Filtrar por distancia</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleReviewPress}>
                                    <Text style={styles.buttonText}>Calificar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={closeModal}>
                                    <Text style={styles.buttonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </>
                        ) : modalContent === 'info' ? (
                            <>
                                <Text style={styles.modalTitle}>{selectedPoint ? selectedPoint.name : 'Loading...'}</Text>
                                <Text style={styles.descriptionText}>{selectedPoint ? selectedPoint.description : 'Loading...'}</Text>
                                <TouchableOpacity style={styles.button} onPress={closeModal}>
                                    <Text style={styles.buttonText}>Cerrar y Volver</Text>
                                </TouchableOpacity>
                            </>
                        ) : modalContent === 'distance' ? (
                            <>
                                <Text style={styles.modalTitle}>Filtrar por distancia</Text>
                                <Text style={styles.descriptionText}>Introduzca la cantidad de metros:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setDistanceFilter}
                                    value={distanceFilter}
                                    placeholder="Cantidad de metros"
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity style={styles.button} onPress={applyDistanceFilter}>
                                    <Text style={styles.buttonText}>Aplicar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={resetFilter}>
                                    <Text style={styles.buttonText}>Eliminar filtro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={closeModal}>
                                    <Text style={styles.buttonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </>
                        ) : modalContent === 'review' ? (
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={styles.keyboardAvoidingView}
                            >
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                    <View style={styles.reviewContainer}>
                                        <Text style={styles.modalTitle}>Califica este punto</Text>
                                        <View style={styles.starsContainer}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                                    <FontAwesome
                                                        name={star <= rating ? "star" : "star-o"}
                                                        size={32}
                                                        color={star <= rating ? "#FFD700" : "#C0C0C0"}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <TextInput
                                            style={[styles.input, styles.commentInput]}
                                            onChangeText={setComment}
                                            value={comment}
                                            placeholder="Añade un comentario (opcional)"
                                            multiline={true}
                                            textAlignVertical="top"
                                        />
                                        <TouchableOpacity style={styles.button} onPress={submitReview}>
                                            <Text style={styles.buttonText}>Enviar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button} onPress={closeModal}>
                                            <Text style={styles.buttonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: 40,
    },
    filterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 0,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        elevation: 2
    },
    filterButton: {
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 1,
        backgroundColor: '#007bff',
        borderRadius: 20,
    },
    filterText: {
        color: '#ffffff',
        fontSize: 16,
    },
    map: {
        flex: 1,
        marginTop: 40,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: 300,
        height: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        width: 200,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '80%',
        padding: 10,
        marginVertical: 10,
    },
    resetButton: {
        backgroundColor: '#ff6347', // Un rojo suave para destacar
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '80%',
        padding: 10,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    commentInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: 300,
    },
});

export default MapScreen;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView, Image, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { FontAwesome } from 'react-native-vector-icons';
import axios from 'axios';
import { auth } from '../config/firebaseConfig';
import AddReview from '../components/AddReview';  // Asegúrate de tener el componente AddReview correctamente implementado

const MapScreen = () => {
    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [selectedRadius, setSelectedRadius] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [distanceOptions] = useState([250, 500, 750, 1000, 2000, 5000]);

    // Cargar puntos al montar el componente
    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await axios.get('http://192.168.1.82:3000/map/points');
                setPoints(response.data);
                setFilteredPoints(response.data); // Mostrar todos los puntos al cargar
            } catch (error) {
                console.error('Error al obtener puntos de interés:', error);
                Alert.alert('Error', 'No se pudieron cargar los puntos de interés.');
            }
        };
        fetchPoints();
    }, []);

    // Actualizar puntos filtrados al cambiar el tipo seleccionado
    useEffect(() => {
        filterPointsByType(selectedType);
    }, [points, selectedType]);

    const filterPointsByType = (type) => {
        if (type === 'all') {
            setFilteredPoints(points);
        } else {
            setFilteredPoints(points.filter(point => point.type === type));
        }
    };

    const openInfoModal = () => {
        if (selectedPoint) setShowInfoModal(true);
    };

    const openRatingModal = () => {
        if (selectedPoint) setShowRatingModal(true);
    };

    const openDistanceModal = () => {
        if (selectedPoint) setShowDistanceModal(true);
    };

    const closeModals = () => {
        setShowInfoModal(false);
        setShowOptionsModal(false);
        setShowRatingModal(false);
        setShowDistanceModal(false);
    };

    const submitRating = async () => {
        if (rating < 1 || rating > 5) {
            Alert.alert('Error', 'Por favor selecciona una calificación válida.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Error', 'Debes iniciar sesión para dejar una reseña.');
                return;
            }

            const idToken = await user.getIdToken();

            await axios.post(`http://192.168.1.82:3000/map/points/${selectedPoint.id}/reviews`, {
                rating,
                comment,
                idToken
            });

            // Actualizar los puntos después de agregar la reseña
            const response = await axios.get('http://192.168.1.82:3000/map/points');
            setPoints(response.data);

            Alert.alert('Éxito', 'Calificación enviada.');
            setShowRatingModal(false);
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
            Alert.alert('Error', 'No se pudo enviar la calificación.');
        }
    };

    const handleDistanceFilter = (distance) => {
        if (!selectedPoint) return;

        const nearbyPoints = points.filter(point => calculateDistance(
            selectedPoint.latitude, selectedPoint.longitude, point.latitude, point.longitude
        ) <= distance);

        setFilteredPoints(nearbyPoints);
        setSelectedRadius(distance);
        setShowDistanceModal(false);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // En metros
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={[
                        { key: 'all', label: 'Todos' },
                        { key: 'museum', label: 'Museo' },
                        { key: 'park', label: 'Parque' },
                        { key: 'historic_site', label: 'Sitio Histórico' },
                        { key: 'restaurant', label: 'Restaurante' },
                        { key: 'other', label: 'Otro' },
                    ]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.filterButton, selectedType === item.key && styles.filterButtonSelected]}
                            onPress={() => setSelectedType(item.key)}
                        >
                            <Text style={styles.filterText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.key}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -35.4264,
                    longitude: -71.6554,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {filteredPoints.map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                        title={point.name}
                        description={point.description}
                        onPress={() => {
                            setSelectedPoint(point);
                            setShowOptionsModal(true);
                        }}
                    />
                ))}
                {selectedPoint && selectedRadius && (
                    <Circle
                        center={{ latitude: selectedPoint.latitude, longitude: selectedPoint.longitude }}
                        radius={selectedRadius}
                        strokeColor="rgba(0, 122, 255, 0.5)"
                        fillColor="rgba(0, 122, 255, 0.2)"
                    />
                )}
            </MapView>

            {/* Modal de Opciones */}
            <Modal
                visible={showOptionsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModals}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Opciones</Text>
                        <TouchableOpacity style={styles.optionButton} onPress={openInfoModal}>
                            <Text style={styles.optionText}>Información</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={openRatingModal}>
                            <Text style={styles.optionText}>Calificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={openDistanceModal}>
                            <Text style={styles.optionText}>Ver puntos cercanos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModals}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Información */}
            <Modal
                visible={showInfoModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowInfoModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedPoint?.name}</Text>
                        <Text>{selectedPoint?.description}</Text>
                        {selectedPoint?.image_url && (
                            <Image
                                source={{ uri: selectedPoint.image_url }}
                                style={{ width: 200, height: 150, marginVertical: 10 }}
                            />
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowInfoModal(false)}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Calificación */}
            <Modal
                visible={showRatingModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowRatingModal(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Califica este lugar</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <FontAwesome
                                        name="star"
                                        size={32}
                                        color={star <= rating ? '#FFD700' : '#ccc'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Escribe un comentario..."
                            placeholderTextColor="#999"
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
                            <Text style={styles.submitButtonText}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowRatingModal(false)}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modal de Puntos Cercanos */}
            <Modal
                visible={showDistanceModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDistanceModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona la distancia</Text>
                        <ScrollView>
                            {distanceOptions.map((dist, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.distanceOption}
                                    onPress={() => handleDistanceFilter(dist)}
                                >
                                    <Text style={styles.distanceText}>{dist} m</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowDistanceModal(false)}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    filterContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
    },
    filterButton: {
        padding: 8,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    filterButtonSelected: {
        backgroundColor: '#007BFF',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
    },
    map: { width: '100%', height: '100%' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginHorizontal: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionButton: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    commentInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        textAlignVertical: 'top',
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    distanceOption: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 5,
    },
    distanceText: {
        fontSize: 16,
        color: '#333',
    },
});

export default MapScreen;

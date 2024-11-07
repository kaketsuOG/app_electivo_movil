import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, FlatList, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { FontAwesome } from 'react-native-vector-icons';
import axios from 'axios';

const MapScreen = () => {
    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [selectedRadius, setSelectedRadius] = useState(null); // Nuevo estado para el radio
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [distanceOptions] = useState([250, 500, 750, 1000, 2000, 5000]);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await axios.get('http://192.168.1.82:3000/map/points');
                setPoints(response.data);
                setFilteredPoints(response.data); // Para resetear puntos filtrados
            } catch (error) {
                console.error('Error al obtener puntos de interés:', error);
            }
        };
        fetchPoints();
    }, []);

    const openOptionsModal = (point) => {
        setSelectedPoint(point);
        setShowOptionsModal(true);
    };

    const closeOptionsModal = () => {
        setShowOptionsModal(false);
    };

    const openInfoModal = () => {
        setShowOptionsModal(false);
        setShowInfoModal(true);
    };

    const closeInfoModal = () => {
        setShowInfoModal(false);
    };

    const openRatingModal = () => {
        setShowOptionsModal(false);
        setShowRatingModal(true);
    };

    const closeRatingModal = () => {
        setShowRatingModal(false);
        setRating(0);
        setComment('');
    };

    const openDistanceModal = () => {
        setShowOptionsModal(false);
        setShowDistanceModal(true);
    };

    const closeDistanceModal = () => {
        setShowDistanceModal(false);
    };

    const submitRating = async () => {
        try {
            await axios.post(`http://192.168.1.82:3000/map/points/${selectedPoint.id}/reviews`, { rating, comment });
            closeRatingModal();
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
        }
    };

    const handleTypeFilter = (type) => {
        setSelectedType(type);
    };

    const filterPointsByType = () => {
        return filteredPoints.filter(point => selectedType === 'all' || point.type === selectedType);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // en metros
    };

    const handleDistanceFilter = (distance) => {
        if (selectedPoint) {
            const nearbyPoints = points.filter(point =>
                calculateDistance(
                    selectedPoint.latitude,
                    selectedPoint.longitude,
                    point.latitude,
                    point.longitude
                ) <= distance
            );
            setFilteredPoints(nearbyPoints);
            setSelectedRadius(distance); // Guardar el radio seleccionado
        }
        closeDistanceModal();
    };

    const placeTypes = [
        { key: 'all', label: 'Todos' },
        { key: 'museum', label: 'Museo' },
        { key: 'park', label: 'Parque' },
        { key: 'historic_site', label: 'Sitio Histórico' },
        { key: 'restaurant', label: 'Restaurante' },
        { key: 'other', label: 'Otro' }
    ];

    return (
        <View style={styles.container}>
            {/* Filtro de tipo de lugar */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={placeTypes}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.key}
                            style={[styles.filterButton, selectedType === item.key && styles.filterButtonSelected]}
                            onPress={() => handleTypeFilter(item.key)}
                        >
                            <Text style={styles.filterText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.key}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Mapa */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -35.4264,
                    longitude: -71.6554,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {filterPointsByType().map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{ latitude: parseFloat(point.latitude), longitude: parseFloat(point.longitude) }}
                        title={point.name}
                        description={point.description}
                        onPress={() => openOptionsModal(point)}
                    />
                ))}

                {/* Círculo de distancia */}
                {selectedPoint && selectedRadius && (
                    <Circle
                        center={{
                            latitude: parseFloat(selectedPoint.latitude),
                            longitude: parseFloat(selectedPoint.longitude)
                        }}
                        radius={selectedRadius}
                        strokeColor="rgba(0, 122, 255, 0.5)"
                        fillColor="rgba(0, 122, 255, 0.2)"
                    />
                )}
            </MapView>

            {/* Modal de opciones */}
            <Modal
                visible={showOptionsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={closeOptionsModal}
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
                        <TouchableOpacity style={styles.closeButton} onPress={closeOptionsModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de información */}
            <Modal
                visible={showInfoModal}
                animationType="slide"
                transparent={true}
                onRequestClose={closeInfoModal}
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
                        <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de calificación */}
            <Modal
                visible={showRatingModal}
                animationType="slide"
                transparent={true}
                onRequestClose={closeRatingModal}
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
                        <TouchableOpacity style={styles.closeButton} onPress={closeRatingModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>


            {/* Modal de selección de distancia */}
            <Modal
                visible={showDistanceModal}
                animationType="slide"
                transparent={true}
                onRequestClose={closeDistanceModal}
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
                        <TouchableOpacity style={styles.closeButton} onPress={closeDistanceModal}>
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
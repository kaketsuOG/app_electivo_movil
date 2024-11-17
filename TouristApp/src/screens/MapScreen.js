import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://192.168.0.2:3000';

const MapScreen = () => {
    const [points, setPoints] = useState([]);
    const [filteredPoints, setFilteredPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [selectedRadius, setSelectedRadius] = useState(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [distanceOptions] = useState([250, 500, 750, 1000, 2000, 5000]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/map/points`);
            setPoints(response.data);
            setFilteredPoints(response.data);
        } catch (error) {
            console.error('Error al obtener puntos de interés:', error);
            setError('Error al cargar los puntos de interés');
        } finally {
            setLoading(false);
        }
    };

    const openOptionsModal = (point) => {
        setSelectedPoint(point);
        setShowOptionsModal(true);
    };

    const closeAllModals = () => {
        setShowOptionsModal(false);
        setShowInfoModal(false);
        setShowRatingModal(false);
        setShowDistanceModal(false);
        setRating(0);
        setComment('');
    };

    const closeInfoModal = () => {
        setShowInfoModal(false);
        setSelectedPoint(null);
    };

    const closeRatingModal = () => {
        setShowRatingModal(false);
        setRating(0);
        setComment('');
        setSelectedPoint(null);
    };

    const closeDistanceModal = () => {
        setShowDistanceModal(false);
        setSelectedPoint(null);
    };

    const submitRating = async () => {
        if (!rating || rating < 1 || rating > 5) {
            alert('Por favor, selecciona una calificación entre 1 y 5');
            return;
        }

        try {
            await axios.post(`${API_URL}/map/points/${selectedPoint.id}/reviews`, {
                rating,
                comment
            });
            alert('¡Gracias por tu calificación!');
            closeRatingModal();
            fetchPoints(); // Recargar los puntos para actualizar la información
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
            alert('Error al enviar la calificación');
        }
    };

    const handleTypeFilter = (type) => {
        setSelectedType(type);
        if (type === 'all') {
            setFilteredPoints(points);
        } else {
            const filtered = points.filter(point => point.type === type);
            setFilteredPoints(filtered);
        }
        setSelectedRadius(null); // Resetear el círculo de distancia al cambiar el filtro
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
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
            setSelectedRadius(distance); // Establecer el radio seleccionado
        }
        setShowDistanceModal(false); // Cerrar el modal de distancia
    };

    const placeTypes = [
        { key: 'all', label: 'Todos' },
        { key: 'museum', label: 'Museo' },
        { key: 'park', label: 'Parque' },
        { key: 'historic_site', label: 'Sitio Histórico' },
        { key: 'restaurant', label: 'Restaurante' },
        { key: 'other', label: 'Otro' }
    ];

    const renderModals = () => (
        <>
            {/* Modal de opciones */}
            <Modal
                visible={showOptionsModal}
                transparent={true}
                animationType="fade"
                onRequestClose={closeAllModals}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeAllModals}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedPoint?.name}</Text>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => setShowInfoModal(true)}
                        >
                            <Text style={styles.optionText}>Información</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => setShowRatingModal(true)}
                        >
                            <Text style={styles.optionText}>Calificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => setShowDistanceModal(true)}
                        >
                            <Text style={styles.optionText}>Ver puntos cercanos</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal de información */}
            <Modal
                visible={showInfoModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeInfoModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedPoint?.name}</Text>
                        <ScrollView style={styles.infoScroll}>
                            <Text style={styles.description}>{selectedPoint?.description}</Text>
                            {selectedPoint?.image_url && (
                                <Image
                                    source={{ uri: selectedPoint.image_url }}
                                    style={styles.pointImage}
                                    resizeMode="cover"
                                />
                            )}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeInfoModal}
                        >
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de calificación */}
            <Modal
                visible={showRatingModal}
                transparent={true}
                animationType="slide"
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
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={styles.starButton}
                                >
                                    <FontAwesome
                                        name={star <= rating ? "star" : "star-o"}
                                        size={32}
                                        color="#FFD700"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Escribe un comentario..."
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            numberOfLines={4}
                        />
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={submitRating}
                        >
                            <Text style={styles.submitButtonText}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeRatingModal}
                        >
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modal de distancia */}
            <Modal
                visible={showDistanceModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeDistanceModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona la distancia</Text>
                        <ScrollView>
                            {distanceOptions.map((dist) => (
                                <TouchableOpacity
                                    key={dist}
                                    style={styles.distanceOption}
                                    onPress={() => handleDistanceFilter(dist)}
                                >
                                    <Text style={styles.distanceText}>{dist} metros</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeDistanceModal}
                        >
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={placeTypes}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                selectedType === item.key && styles.filterButtonSelected
                            ]}
                            onPress={() => handleTypeFilter(item.key)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedType === item.key && styles.filterTextSelected
                            ]}>
                                {item.label}
                            </Text>
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
                {/* Renderizar el círculo primero */}
                {selectedPoint && selectedRadius && (
                    <Circle
                        center={{
                            latitude: parseFloat(selectedPoint.latitude),
                            longitude: parseFloat(selectedPoint.longitude)
                        }}
                        radius={selectedRadius}
                        strokeColor="rgba(0, 122, 255, 0.5)"
                        fillColor="rgba(0, 122, 255, 0.2)"
                        zIndex={1} // Asegurar que el círculo no bloquee el mapa
                    />
                )}

                {/* Renderizar los puntos después */}
                {filteredPoints.map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{
                            latitude: parseFloat(point.latitude),
                            longitude: parseFloat(point.longitude)
                        }}
                        title={point.name}
                        description={point.description}
                        onPress={() => openOptionsModal(point)}
                    />
                ))}
            </MapView>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchPoints}
                    >
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {renderModals()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    filterButtonSelected: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
    },
    filterTextSelected: {
        color: '#fff',
    },
    map: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    optionButton: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    optionText: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#e9ecef',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '500',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    starButton: {
        padding: 5,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#495057',
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 10,
    },
    distanceOption: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    distanceText: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
    },
    infoScroll: {
        maxHeight: 400,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#495057',
        marginBottom: 15,
        lineHeight: 24,
    },
    pointImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    errorContainer: {
        position: 'absolute',
        top: '50%',
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default MapScreen;
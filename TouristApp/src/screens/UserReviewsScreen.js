import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UserReviewsScreen = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    alert('Tu sesión ha expirado, por favor inicia sesión nuevamente.');
                    return;
                }

                const userId = JSON.parse(atob(token.split('.')[1])).id;
                console.log('UserID obtenido:', userId);

                const response = await axios.get(`http://192.168.0.4:3000/review/user/${userId}`, {
                    headers: { 'x-access-token': token }
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Error loading reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

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
            <FlatList
                data={reviews}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewPlaceName}>{item.placeName}</Text>
                        <Text style={styles.reviewTitle}>Calificación: {item.rating}</Text>
                        <Text style={styles.reviewBody}>Comentario: {item.comment}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    reviewItem: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    reviewPlaceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a9d8f'  // Color distintivo para el nombre del lugar
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    reviewBody: {
        fontSize: 16,
        color: '#666'
    },
});

export default UserReviewsScreen;

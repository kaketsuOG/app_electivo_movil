import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserReviewsScreen = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem('userToken');
                const userId = jwtDecode(token).id; // Asegúrate de tener jwt-decode instalado y de que el token incluye el ID como 'id'
                const response = await axios.get(`http://192.168.1.82:3000/user/${userId}`, {
                    headers: { 'x-access-token': token },
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching user reviews:', error);
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
                        <Text style={styles.reviewText}>Rating: {item.rating}</Text>
                        <Text style={styles.reviewText}>Comment: {item.comment}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    reviewText: {
        fontSize: 16,
    },
});

export default UserReviewsScreen;

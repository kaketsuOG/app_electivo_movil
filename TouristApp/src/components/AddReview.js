import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { auth } from '../config/firebaseConfig'; // Importación corregida

const AddReview = ({ pointId, onReviewAdded }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!rating || rating < 1 || rating > 5) {
            setMessage('La calificación debe estar entre 1 y 5');
            return;
        }

        try {
            setIsLoading(true);
            const user = auth.currentUser;
            if (!user) {
                setMessage('Error: Usuario no autenticado');
                setIsLoading(false);
                return;
            }

            const idToken = await user.getIdToken();

            if (!idToken || typeof idToken !== 'string') {
                console.error('idToken inválido:', idToken);
                setMessage('Error al obtener el token de autenticación');
                setIsLoading(false);
                return;
            }

            console.log('Enviando datos al backend:', {
                pointId,
                rating: parseInt(rating),
                comment,
                idToken,
            });

            await axios.post(`http://192.168.1.38:3000/map/points/${pointId}/reviews`, {
                rating: parseInt(rating),
                comment,
                idToken,
            });

            setMessage('¡Reseña enviada!');
            setRating('');
            setComment('');
            onReviewAdded();
        } catch (error) {
            console.error('Error al enviar reseña:', error?.response?.data || error.message);
            setMessage('Error al enviar la reseña');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Calificación (1-5)"
                value={rating}
                onChangeText={setRating}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Comentario"
                value={comment}
                onChangeText={setComment}
                multiline
            />
            <Button
                title={isLoading ? 'Enviando...' : 'Enviar Reseña'}
                onPress={handleSubmit}
                disabled={isLoading}
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    input: {
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    message: {
        marginTop: 10,
        textAlign: 'center',
        color: '#d9534f',
    },
});

export default AddReview;
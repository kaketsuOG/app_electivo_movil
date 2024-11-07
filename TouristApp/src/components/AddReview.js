import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';

const AddReview = ({ pointId, onReviewAdded }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (!rating || rating < 1 || rating > 5) {
            setMessage('La calificación debe estar entre 1 y 5');
            return;
        }

        try {
            await axios.post(`http://192.168.1.38:3000/map/points/${pointId}/reviews`, {
                rating: parseInt(rating),
                comment,
            });
            setMessage('¡Reseña enviada!');
            onReviewAdded(); // Recargar las reseñas
        } catch (error) {
            console.error('Error al enviar reseña:', error);
            setMessage('Error al enviar reseña');
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
            />
            <Button title="Enviar Reseña" onPress={handleSubmit} />
            {message ? <Text>{message}</Text> : null}
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
});

export default AddReview;
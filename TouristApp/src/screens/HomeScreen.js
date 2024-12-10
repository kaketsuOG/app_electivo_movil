import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../../assets/talcaplaza_background.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Explora Talca</Text>
                <Text style={styles.subtitle}>Descubre la magia de nuestra ciudad</Text>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Map')}>
                        <Icon name="map-outline" size={30} color="#4CAF50" />
                        <Text style={styles.cardText}>Mapa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
                        <Icon name="person-outline" size={30} color="#2196F3" />
                        <Text style={styles.cardText}>Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserReviews')}>
                        <Icon name="location-outline" size={30} color="#FF9800" />
                        <Text style={styles.cardText}>Calificación de Puntos de Interés</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)', // Oscurece el fondo para resaltar el contenido
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 30,
    },
    cardContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        marginVertical: 10,
        width: '90%',
        borderRadius: 15,
        elevation: 5,
    },
    cardText: {
        fontSize: 18,
        color: '#333',
        marginLeft: 15,
        fontWeight: 'bold',
    },
});

export default HomeScreen;

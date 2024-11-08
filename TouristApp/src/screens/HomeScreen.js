import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.gradientContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Bienvenido a la Aplicación</Text>
                
                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Map')}>
                        <Icon name="map-outline" size={30} color="#4CAF50" />
                        <Text style={styles.cardText}>Mapa</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
                        <Icon name="person-outline" size={30} color="#2196F3" />
                        <Text style={styles.cardText}>Perfil</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PointsOfInterest')}>
                        <Icon name="location-outline" size={30} color="#FF9800" />
                        <Text style={styles.cardText}>Puntos de Interés</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        backgroundColor: '#FFCC80',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: 'linear-gradient(to bottom, #FF8A65, #FFCC80)', // Aplicando el gradiente
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF', // Blanco para resaltar en el fondo
        marginBottom: 20,
    },
    cardContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFF',
        padding: 15,
        marginVertical: 10,
        width: '90%',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    cardText: {
        fontSize: 18,
        color: '#333',
        marginLeft: 15,
    },
});

export default HomeScreen;

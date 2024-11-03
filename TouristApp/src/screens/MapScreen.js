import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
    const initialRegion = {
        latitude: -33.4489,  // Coordenadas iniciales
        longitude: -70.6693,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    // Ejemplo de puntos de interés
    const pointsOfInterest = [
        {
            id: 1,
            title: "Museo Nacional",
            description: "Museo histórico",
            latitude: -33.4475,
            longitude: -70.6736,
        },
        {
            id: 2,
            title: "Parque Forestal",
            description: "Parque popular",
            latitude: -33.4368,
            longitude: -70.6436,
        },
    ];

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
            >
                {pointsOfInterest.map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                        title={point.title}
                        description={point.description}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
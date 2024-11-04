import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Welcome to the Home Screen!</Text>
            {/* Botón para ir a la pantalla del mapa */}
            <Button title="Go to Map" onPress={() => navigation.navigate('Map')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});

export default HomeScreen;
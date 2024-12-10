import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ImageBackground } from 'react-native';
import authService from '../services/authService';

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [newData, setNewData] = useState({ username: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await authService.getUserProfile();
                setUserData(data);
                setNewData({ username: data.username, email: data.email, password: '' });
            } catch (error) {
                Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            if (newData.password && newData.password.length < 6) {
                Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            const response = await authService.updateUserProfile(newData);
            if (response.error) {
                Alert.alert('Error', response.error);
            } else {
                setUserData(newData);
                setIsEditing(false);
                Alert.alert('Éxito', 'Perfil actualizado correctamente.');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil.');
        }
    };

    const handleLogout = () => {
        Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas cerrar sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar Sesión', style: 'destructive', onPress: () => navigation.replace('Login') },
        ]);
    };

    return (
        <ImageBackground
            source={require('../../assets/talcaarmas_background.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Mi Perfil</Text>
                    {!isEditing ? (
                        <>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Nombre de usuario:</Text>
                                <Text style={styles.value}>{userData.username}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Email:</Text>
                                <Text style={styles.value}>{userData.email}</Text>
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                                <Text style={styles.buttonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Nuevo nombre de usuario"
                                value={newData.username}
                                onChangeText={(text) => setNewData({ ...newData, username: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Nuevo email"
                                value={newData.email}
                                onChangeText={(text) => setNewData({ ...newData, email: text })}
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Nueva contraseña"
                                value={newData.password}
                                onChangeText={(text) => setNewData({ ...newData, password: text })}
                                secureTextEntry={true}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSave}>
                                <Text style={styles.buttonText}>Guardar Cambios</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    )}
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    card: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    infoContainer: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
    },
    label: {
        fontSize: 14,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#FFF',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    logoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#FF5722',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default ProfileScreen;

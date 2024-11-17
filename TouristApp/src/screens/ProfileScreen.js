import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import authService from '../services/authService';

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await authService.getUserProfile(); 
                setUserData(data);
            } catch (error) {
                Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            if (!newEmail || newEmail === userData.email) {
                Alert.alert('Error', 'El email no ha cambiado.');
                return;
            }

            const updatedData = { email: newEmail };

            // Llamamos al servicio de actualización de perfil
            await authService.updateUserProfile(updatedData);
            setUserData((prevData) => ({
                ...prevData,
                email: updatedData.email || prevData.email,
            }));
            setIsEditing(false);
            Alert.alert('Éxito', 'Perfil actualizado correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil.');
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigation.navigate('Login');
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
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

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                                <Text style={styles.buttonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nuevo email"
                            value={newEmail}
                            onChangeText={setNewEmail}
                            keyboardType="email-address"
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSave}>
                                <Text style={styles.buttonText}>Guardar Cambios</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    profileContainer: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#222',
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
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

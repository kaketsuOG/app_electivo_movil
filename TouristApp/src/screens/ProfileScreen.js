import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import authService from '../services/authService';

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
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
        console.log("Datos enviados al servidor:", newData); // Añade esto para verificar los datos
        try {
            // Validación básica...
            if (newData.password && newData.password.length < 6) {
                Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            const response = await authService.updateUserProfile(newData);
            console.log("Respuesta del servidor:", response); // Verifica qué responde el servidor
            if (response.error) {
                Alert.alert('Error', response.error);
            } else {
                setUserData(newData);
                setIsEditing(false);
                Alert.alert('Éxito', 'Perfil actualizado correctamente.');
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error); // Muestra errores si ocurren
            Alert.alert('Error', 'No se pudo actualizar el perfil.');
        }
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
                        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                            <Text style={styles.buttonText}>Editar Perfil</Text>
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
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { AuthContext } from '../context/authContext';

const RegisterScreen = ({ navigation }) => {
    const { register } = useContext(AuthContext); // Acceder al método de registro desde el contexto
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        // Validaciones
        if (!username) {
            setMessage('El nombre de usuario es obligatorio.');
            return;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setMessage('Por favor ingresa un email válido.');
            return;
        }
        if (!password || password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            await register(username, email, password); // Usamos el register del contexto
            setMessage('Registro exitoso');
            navigation.navigate('Login');
        } catch (error) {
            setMessage('Error al registrar el usuario');
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/talca-background.jpg')} // Imagen de fondo
            style={styles.background}
            resizeMode='cover'
        >
            <View style={styles.container}>
                <Text style={styles.title}>Registro</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
                {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    message: {
        color: 'green',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default RegisterScreen;
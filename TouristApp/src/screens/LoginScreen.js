import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import authService from '../services/authService';


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        // Validaciones
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setMessage('Por favor ingresa un email válido.');
            return;
        }
        if (!password) {
            setMessage('La contraseña es obligatoria.');
            return;
        }

        try {
            const response = await authService.login(email, password);
            setMessage('Login exitoso');
            navigation.navigate('Home');
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'Error de conexión');
        }
    };

    return (
        <ImageBackground 
            source={require('../../assets/talca-background.jpg')} // Imagen de fondo que debes añadir en la carpeta assets
            style={styles.background}
            resizeMode='cover'  //Con esto la imagen se vera completa sin recortes
        >
            <View style={styles.container}>
                <Text style={styles.title}>Bienvenido a Talca</Text>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                {message ? <Text style={styles.message}>{message}</Text> : null}
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
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
    registerText: {
        marginTop: 20,
        color: '#4A90E2',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;

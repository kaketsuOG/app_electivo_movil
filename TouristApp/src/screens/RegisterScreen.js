import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import authService from '../services/authService';

const RegisterScreen = ({ navigation }) => {
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
            const response = await authService.register(username, email, password);
            setMessage(response.message);
            navigation.navigate('Login');
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'Error de conexión');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Register" onPress={handleRegister} />
            {message ? <Text>{message}</Text> : null}
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
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
});

export default RegisterScreen;
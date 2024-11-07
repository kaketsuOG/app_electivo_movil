import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Text>Login</Text>
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
            <Button title="Login" onPress={handleLogin} />
            {message ? <Text>{message}</Text> : null}
            <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
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

export default LoginScreen;
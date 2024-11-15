import React, { createContext, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const data = await authService.login(email, password);
            setUser(data); // Asume que la respuesta contiene la información del usuario
        } catch (error) {
            console.error('Login error', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        try {
            setLoading(true);
            const data = await authService.register(username, email, password);
            setUser(data); // Asume que la respuesta contiene la información del usuario
        } catch (error) {
            console.error('Registration error', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
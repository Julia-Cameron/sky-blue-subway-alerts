import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock profiles for testing UI states 
const MOCK_USERS = {
    guest: null, 
    user: {
        id: '01',
        name: 'John Doe',
        email: 'tmp@gmail.com',
        role: 'user',
    }
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(MOCK_USERS.guest);

    // Mock functions for interactions
    const loginAsUser = () => {
        setCurrentUser(MOCK_USERS.user);
    }

    const logout = () => {
        setCurrentUser(MOCK_USERS.guest);
    }

    const value = {
        user: currentUser,
        isAuthenticated: Boolean(currentUser),
        loginAsUser,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
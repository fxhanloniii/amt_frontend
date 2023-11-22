import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Initialize with the appropriate value
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUserToken = async () => {
      try {
        // Load the user token on mount
        const authToken = await SecureStore.getItemAsync('usertoken');
        if (authToken) {
          setToken(authToken);
          setIsSignedIn(true);

          // Fetch user information using the token
          const userResponse = await fetch('http://127.0.0.1:8000/dj-rest-auth/user/', {
            method: 'GET',
            headers: {
              'Authorization': `Token ${authToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
            console.log(user)
          } else {
            console.error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error loading user token:', error);
      }
    };

    // Call the loadUserToken function
    loadUserToken();
  }, []);

  // function to set user token
  const setAuthToken = async (authToken) => {
    setToken(authToken);
    // store the user token in Secure Store
    await SecureStore.setItemAsync('usertoken', authToken);
  }
  const signIn = async (email, password) => {
    try {
      // Call your login function from auth.js here
      const response = await loginUser(email, password);
      
      // Check if login was successful based on the response
      if (response.success) {
        setIsSignedIn(true);
        // store the user token securely
        setAuthToken(response.key);
      } else {
        // Handle login failure, e.g., show an error message
      }
    } catch (error) {
      // Handle login error, e.g., show an error message
    }
  };

  const signOut = async () => {
    try {
      // Call your logout function from auth.js here
      const response = await logoutUser(token);
      
      // Check if logout was successful based on the response
      if (response.success) {
        setIsSignedIn(false);
        // clear the user token from SecureStore
        await SecureStore.deleteItemAsync('usertoken');
      } else {
        // Handle logout failure, e.g., show an error message
      }
    } catch (error) {
      // Handle logout error, e.g., show an error message
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, token, setAuthToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};
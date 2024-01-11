import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { logoutUser, loginUser } from '../api/auth';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Initialize with the appropriate value
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null)

  const loadUserToken = async () => {
    try {
      const authToken = await SecureStore.getItemAsync('usertoken');
      if (authToken) {
        setToken(authToken);
        await fetchUserData(authToken);
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Error loading user token:', error);
    }
  };

  const fetchUserData = async (authToken) => {
    try {
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
              } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
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
        const response = await loginUser(email, password);
        console.log("signing in user")
        // Check if login was successful based on the response
        if (response.success) {
            setIsSignedIn(true);
            setAuthToken(response.token); // Change this line to response.key
                        fetchUserData(response.token);
        } else {
            // Handle login failure, e.g., show an error message
            console.error('Login failed:', response.error); // Log the error message
        }
    } catch (error) {
        // Handle login error, e.g., show an error message
        console.error('Login error:', error);
    }
};

  const signOut = async () => {
    console.log("Attempting to log out"); // New log
    try {
      const response = await logoutUser(token);
      console.log("Response received", response); // New log
      if (response.success) {
        setIsSignedIn(false);
                await SecureStore.deleteItemAsync('usertoken');
        setUser(null);
        setToken(null);
      } else {
        console.log("Logout failed"); // New log
      }
    } catch (error) {
      console.error("Logout error:", error); // New log
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, token, setAuthToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};
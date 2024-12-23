import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { logoutUser, loginUser } from '../api/auth';
const AuthContext = createContext();
const BASE_URL = "http://3.101.60.200:8080";

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Initialize with the appropriate value
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null)
  const [zipCode, setZipCode] = useState('');

  const loadUserToken = async () => {
    try {
      const authToken = await SecureStore.getItemAsync('usertoken');
      if (authToken) {
        setToken(authToken);
        console.log("Retrieved token:", authToken);
        await fetchUserData(authToken);
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Error loading user token:', error);
    }
  };

  const fetchUserData = async (authToken) => {
    try {
      const userResponse = await fetch(`${BASE_URL}/dj-rest-auth/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        console.log("Retrieved user data:", userData);

        // Fetch user profile to get the zip code
        const profileResponse = await fetch(`${BASE_URL}/profiles/user/${userData.pk}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setZipCode(profileData.zip_code);
          console.log("Retrieved profile data:", profileData);
        } else {
          console.error('Failed to fetch profile data');
        }
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
            setAuthToken(response.token); 
            fetchUserData(response.token);
            return true; 
        } else {
            
            console.error('Login failed:', response.error); // Log the error message
            return false;
        }
    } catch (error) {
        // Handle login error, e.g., show an error message
        console.error('Login error:', error);
        return false
        
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
        setZipCode('');
      } else {
        console.log("Logout failed"); // New log
      }
    } catch (error) {
      console.error("Logout error:", error); // New log
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, token, setAuthToken, user, zipCode }}>
      {children}
    </AuthContext.Provider>
  );
};
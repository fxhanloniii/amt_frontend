
// Backend API for authentication

const BASE_URL = 'http://127.0.0.1:8000'

// Function to register a user
export const registerUser = async (username, email, password, confirmPassword) => {
    console.log(`${BASE_URL}/dj-rest-auth/registration/`);
    const response = await fetch(`${BASE_URL}/dj-rest-auth/registration/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password1: password,
            password2: confirmPassword,
        }),
    });
    
    // console.log('Registration response:', response);

    if (response.status === 204) {
        // Registration successful 
        console.log('Registration successful.');
        
    } else {
        // Registration failed or encountered an error
        const errorData = await response.json().catch(() => ({})); // Handle potential JSON parse error
        
    }
};

// function to log in a user and retrieve the user token
// Function to log in a user and retrieve the user token
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/dj-rest-auth/login/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(data.key)
            return { success: true, token: data.key };
        } else {
            // Log for debugging
            console.log('Login failed with status:', response.status);
            const errorData = await response.json();
            return { success: false, token: null, error: errorData };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, token: null, error: error.message };
    }
};


// Function to log out a user using their token

export const logoutUser = async (token) => {
    console.log("Logging out with token:", token);
    try {
        const response = await fetch(`${BASE_URL}/dj-rest-auth/logout/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        if (response.status === 200) {
            return { success: true }; // Logout Successful
        } else {
            console.error('Logout response:', response); // Log the response
            return { success: false };
        }
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};




// Function to request a password reset
export const requestPasswordReset = async (email) => {
    const response = await fetch(`${BASE_URL}/dj-rest-auth/password/reset/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
        }),
    });
    return response.json();
};

// Function to change the user's password
export const changePassword = async (token, newPassword1, newPassword2) => {
    const response = await fetch(`${BASE_URL}/dj-rest-auth/password/change/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            new_password1: newPassword1,
            new_password2: newPassword2,
        }),
    });
    return response.json();
};

// Function to retrieve the user's profile details
export const getUserProfile = async (token) => {
    const response = await fetch(`${BASE_URL}/dj-rest-auth/user/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    return response.json();
};

// Function to update the user's profile details
export const updateUserProfile = async (token, data) => {
    const response = await fetch(`${BASE_URL}/dj-rest-auth/user/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    });
    return response.json();
};



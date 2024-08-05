
// Backend API for authentication

const BASE_URL = 'http://localhost:8000';



export const registerUser = async (username, email, password, confirmPassword, zipCode, profilePictureUrl) => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password1', password);
        formData.append('password2', confirmPassword);   // Add lastName to FormData
        formData.append('zip_code', zipCode);
        formData.append('profile_picture_url', profilePictureUrl);

         // Log each value before appending
         console.log('username:', username);
         console.log('email:', email);
         console.log('password1:', password);
         console.log('password2:', confirmPassword);
         console.log('zip_code:', zipCode);
         console.log('profile_picture_url:', profilePictureUrl);
        

        const response = await fetch(`${BASE_URL}/dj-rest-auth/registration/`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, token: data.token, userId: data.user_id };
        } else {
            const errorData = await response.json();
            console.log('Registration error:', errorData);
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return { success: false, error: 'An error occurred during registration' };
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



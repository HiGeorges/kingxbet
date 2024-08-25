import apiClient from '../apiClient.ts';

type UserModal = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    referralCode: string;
    referral: string;
    role: string;
    status: string;
    createdDate: string;
    updatedDate: string;
};

type RegisterResponse = {
    success: boolean;
    message: string;
    data?: UserModal;
};

interface RegisterData {
    fullName: string;
    email: string;
    phoneNumber: string;
    referral: string;
}

export const registerService = async (
    payload: RegisterData,
): Promise<RegisterResponse> => {
    try {
        // Vérification des données avant de faire la requête
        if (!payload.fullName || !payload.email || !payload.phoneNumber) {
            throw new Error("Please provide all the required fields: fullName, email, and phoneNumber.");
        }

        const response = await apiClient.post<RegisterResponse>(
            '/auth/register',
            payload,
        );

        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Registration failed');
        }
    } catch (error: any) {
        // Gestion des erreurs réseau et API
        if (error.response) {
            // Erreurs renvoyées par l'API
            console.error('API Error:', error.response.data.message || error.message);
            throw new Error(error.response.data.message || 'An error occurred during registration.');
        } else if (error.request) {
            // Erreurs réseau
            console.error('Network Error:', error.message);
            throw new Error('A network error occurred. Please try again later.');
        } else {
            // Erreurs inconnues
            console.error('Unexpected Error:', error.message);
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
};

import apiClient from '../apiClient.ts';

type OtpResponse = {
    success: boolean;
    message: string;
};

interface OtpData {
    email: string;
}

export const otpService = async (payload: OtpData): Promise<OtpResponse> => {
    try {
        // Vérification de l'email avant d'envoyer la requête
        if (!payload.email) {
            throw new Error('Email is required to send OTP.');
        }

        const response = await apiClient.post<OtpResponse>(
            'auth/send-otp',
            payload,
        );

        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to send OTP.');
        }
    } catch (error: any) {
        // Gestion des erreurs réseau et API
        if (error.response) {
            // Erreurs renvoyées par l'API
            console.error('API Error:', error.response.data.message || error.message);
            throw new Error(error.response.data.message || 'An error occurred while sending OTP.');
        } else if (error.request) {
            // Erreurs réseau
            console.error('Network Error:', error.message);
            throw new Error('A network error occurred. Please check your connection and try again.');
        } else {
            // Erreurs inattendues
            console.error('Unexpected Error:', error.message);
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
};

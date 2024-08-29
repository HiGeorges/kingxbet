import apiClient from '../apiClient.ts';
import { useAuthStore } from "../../zustand/authStore.ts";

type DepositOperationResponse = {
    success: boolean;
    message: string;
};

interface DepositOperationData {
    xbetId: number;
    amount: number;
    phoneNumber: string;
    network: string;
}

export const depositOperationService = async (
    payload: DepositOperationData,
): Promise<DepositOperationResponse> => {
    try {
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        // Définir un délai d'attente (timeout) pour la requête
        const response = await apiClient.post<DepositOperationResponse>(
            'operations/deposit',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 120000,
            },
        );

        // Vérification de la réponse du serveur
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Operation failed.');
        }
    } catch (error: any) {
        // Gestion des erreurs d'authentification
        if (error.response?.status === 401) {
            useAuthStore.getState().setIsLoggedIn(false);
            throw new Error('Your session has expired. Please log in again.');
        }
        // Gestion des erreurs de validation
        if (error.response?.status === 400) {
            throw new Error(error.response.data.message || 'Invalid request. Please check your data.');
        }
        // Gestion des erreurs réseau
        if (error.code === 'ECONNABORTED') {
            throw new Error('Operation timeout. Deposit operation failed. Please try again later.');
        }
        // Gestion des erreurs réseau générales
        if (error.request) {
            throw new Error('Network error. Please check your connection and try again.');
        }
        // Gestion des erreurs inattendues
        console.error('Unexpected Error:', error.message);
        throw new Error('An unexpected error occurred. Please try again later.');
    }
};

import apiClient from '../apiClient.ts';
import { useAuthStore } from "../../zustand/authStore.ts";

type HistoryResponse = {
    success: boolean;
    message: string;
    data: any[];
};

export const historyService = async (): Promise<HistoryResponse> => {
    try {
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        // Requête vers l'API pour obtenir l'historique des opérations
        const response = await apiClient.get<HistoryResponse>('operations/history', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Vérification de la réponse du serveur
        if (response.data) {
            return response.data;
        } else {
            throw new Error(response.data || 'Failed to fetch history.');
        }
    } catch (error: any) {
        // Gestion des erreurs d'authentification
        if (error.response?.status === 401) {
            useAuthStore.getState().setIsLoggedIn(false);
            throw new Error('Your session has expired. Please log in again.');
        }
        // Gestion des erreurs réseau ou autres
        throw new Error('An unexpected error occurred. Please try again later.');
    }
};

import apiClient from '../apiClient';
import { useAuthStore } from "../../zustand/authStore";
import { userService } from "../user/userService";
import { walletService } from "../wallet/walletService.ts";

type LoginResponse = {
    success: boolean;
    message: string;
    token: string;
};

interface LoginData {
    email: string;
    otpCode: string;
}

export const loginService = async (payload: LoginData) => {
    try {
        const response = await apiClient.post<LoginResponse>('auth/login', payload);

        if (response.data.success && response.data.token) {
            const { token } = response.data;
            localStorage.setItem('userToken', token);

            const userInfosResponse = await userService();
            if (userInfosResponse?.data) {
                localStorage.setItem('UserInfos', JSON.stringify(userInfosResponse.data));
                useAuthStore.getState().setIsLoggedIn(true);

                // Appel du service wallet pour obtenir le solde
                const walletResponse = await walletService(token);

                // Stocker la valeur de balance uniquement dans le localStorage
                localStorage.setItem('balanceEarned', JSON.stringify(walletResponse.earnedBalance));

                return response.data;

            } else {
                throw new Error('Failed to fetch user information');
            }
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

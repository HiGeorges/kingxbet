import apiClient from '../apiClient';
import {UserModel} from './userModel';
import {useAuthStore} from "../../zustand/authStore";

type UserResponse = {
    success: boolean;
    message: string;
    data?: UserModel;
};

export const userService = async () => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await apiClient.get<UserResponse>('users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success && response.data.data) {
            return response.data;
        } else {
            useAuthStore.getState().setIsLoggedIn(false);
            throw new Error(response.data.message || 'Failed to fetch user profile');
        }
    } catch (error: any) {
        if (error.response?.status === 401) {
            useAuthStore.getState().setIsLoggedIn(false);
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

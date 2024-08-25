import apiClient from '../apiClient';
import { WalletModel } from './walletModel.ts';
import { useAuthStore } from "../../zustand/authStore.ts";

type WalletResponse = {
  data: WalletModel;
};

export const walletService = async (token: string): Promise<any> => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await apiClient.get<WalletResponse>('wallet/earned', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response.data.statusCode === 401) {
      useAuthStore.getState().setIsLoggedIn(false);
    }
    throw error;
  }
};

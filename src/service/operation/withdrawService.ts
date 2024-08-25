import apiClient from '../apiClient.ts';
import {useAuthStore} from "../../zustand/authStore.ts";

type WithdrawOperationResponse = {
  success: boolean;
  message: string;
};

interface WithdrawOperationData {
  xbetId: number;
  code: string;
  phoneNumber: string;
  network: string;
}
export const withdrawOperationService = async (
  payload: WithdrawOperationData,
): Promise<WithdrawOperationResponse> => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await apiClient.post<WithdrawOperationResponse>(
      'operations/withdraw',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Operation failed');
    }
  } catch (error: any) {
    if (error.response.data.statusCode === 401) {
      useAuthStore.getState().setIsLoggedIn(false);
    } else if (error.response.data.statusCode === 400) {
      return error.response.data.message;
    }
    throw error;
  }
};

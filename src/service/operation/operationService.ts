import apiClient from '../apiClient';
import {OperationModel} from './operationModel.ts';

export const operationService = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiClient.get<OperationModel>(
      '/operations/history',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response.data.statusCode === 401) {
      localStorage.getState().setIsLoggedIn(false);
    } else if (error.response.data.statusCode === 400) {
      return error.response.data.message;
    }
    console.log('error:', error);
    throw error;
  }
};

export const operationDepositService = async (): Promise<any> => {};

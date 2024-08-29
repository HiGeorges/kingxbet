import {UserModel} from '../user/userModel.ts';

export interface WalletModel {
  id: string;
  balance: string;
  referralBalance: string;
  earnedBalance: string;
  createdDate: string;
  updatedDate: string;
  user: UserModel;
}

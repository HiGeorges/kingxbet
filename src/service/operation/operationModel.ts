import {UserModel} from '../user/userModel.ts';

export interface OperationModel {
  id: string;
  amount: string;
  type: string;
  status: string;
  createdDate: string;
  updatedDate: string;
  user: UserModel;
}

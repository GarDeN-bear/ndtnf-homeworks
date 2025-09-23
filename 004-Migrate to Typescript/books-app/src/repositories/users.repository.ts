import { injectable } from "inversify";

import User from "../interfaces/user.interface";
import UserModel from "../db/users";

@injectable()
export default class UsersRepository {
  async createUser(user: User): Promise<void> {
    const newUser = new UserModel({ ...user });
    await newUser.save();
  }

  async getUser(id: string): Promise<User | null> {
    return await UserModel.findById(id).select("-__v").exec();
  }
  
  async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username }).select("-__v").exec();
  }

  async getUsers(): Promise<User[]> {
    return await UserModel.find().select("-__v").exec();
  }

  async updateUser(id: number, updatedUser: User): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { ...updatedUser });
  }

  async deleteUser(id: number): Promise<void> {
    await UserModel.deleteOne({ _id: id });
  }

}

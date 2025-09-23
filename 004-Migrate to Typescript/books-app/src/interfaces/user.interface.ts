import { Document } from "mongoose";

export default interface User extends Document {
  id?: string;
  username: string;
  password: string;
  verifyPassword(candidatePassword: string): boolean;
}

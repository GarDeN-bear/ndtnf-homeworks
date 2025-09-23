import { Schema, model } from "mongoose";
import User from "../interfaces/user.interface";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: "",
  },
  password: {
    type: String,
    required: true,
    default: "",
  },
});

userSchema.methods.verifyPassword = function(candidatePassword: string): boolean {
  return this.password == candidatePassword;
};

export default model<User>("User", userSchema);

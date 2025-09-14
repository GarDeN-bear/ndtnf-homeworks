import { Schema, model } from "mongoose";

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

userSchema.methods.verifyPassword = function(candidatePassword) {
  return this.password == candidatePassword;
};

export default model("User", userSchema);

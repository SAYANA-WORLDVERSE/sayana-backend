import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: { type: "string", unique: true, required: true },
  email: { type: "string", unique: true},
  mobile: { type: "Number", required: true},
  password: { type: "string", required: true },
  date: { type: Date, default: Date.now}
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user && user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  user.date= new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

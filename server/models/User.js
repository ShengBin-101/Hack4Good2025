import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    birthday: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    userPicturePath: {
      type: String,
      default: "",
    },
    voucher: {
      type: Number,
      default: 10, // Everyone starts off with 10 Vouchers
      min: 0,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending", // "pending", "approved", "rejected"
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

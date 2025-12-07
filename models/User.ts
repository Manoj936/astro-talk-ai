import mongoose from "mongoose";
import { hashPassword } from "../lib/password";

export interface IUser {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  _id: mongoose.Types.ObjectId;
  isVerified: boolean;
  role: "admin" | "user";
  softDelete?: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, minlength: 8 },
    name: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    softDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

(userSchema.pre as any)(
  "save",
  async function (
    this: mongoose.HydratedDocument<IUser>,
    next: (err?: Error) => void
  ) {
    if (this.isModified("password")) {
      this.password = await hashPassword(this.password, 10);
    }
    next();
  }
);
const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;

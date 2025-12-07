import mongoose from "mongoose";


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

// Add indexes for commonly queried fields
userSchema.index({ isVerified: 1 });
userSchema.index({ role: 1 });
userSchema.index({ softDelete: 1 });
userSchema.index({ createdAt: -1 }); // For sorting by creation date


// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await hashPassword(this.password, 10);
//     console.log(this.password , "presave checking")
//   }
//   next();
// });

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;

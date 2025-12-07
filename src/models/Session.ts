import mongoose from "mongoose";

export interface ISession {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  lastMessage?: string;
  ipAddress?: string;
  messageCount?: number;
  title: string;
  updatedAt?: Date;
  createdAt?: Date;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    messageCount: {
      type: Number,
      
    },
  },
  { timestamps: true }
);

// Add indexes for commonly queried fields
sessionSchema.index({ userId: 1 });
sessionSchema.index({ createdAt: -1 }); // For sorting by creation date

const Session =
  mongoose.models?.Session ||
  mongoose.model<ISession>("Session", sessionSchema);

export default Session;

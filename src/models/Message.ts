import mongoose from "mongoose";

// As MongoDB has a cap size of 16mb per document, we are not going to store messages inside an array in session document.
// So we are storing each message in a document instead.
export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  content: string;
  role: "user" | "assistant";
  tokensEstimate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50000, // Prevent extremely large messages 
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    tokensEstimate: {
      type: Number,
      min: 0, // Tokens cannot be negative
      default: 0,
    },
  },
  { timestamps: true }
);

// Add indexes for commonly queried fields
messageSchema.index({ userId: 1, sessionId: 1, createdAt: 1 }); // Compound index for querying messages by user and session in chronological order
messageSchema.index({ sessionId: 1, createdAt: 1 }); // Compound index for querying messages by session in chronological order
messageSchema.index({ createdAt: -1 }); // For sorting messages by creation date

const Message =
  mongoose.models?.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
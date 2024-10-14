import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  sender: mongoose.Schema.Types.ObjectId;  // Reference to User
  recipient: mongoose.Schema.Types.ObjectId;  // Reference to User
  message: string;
}

const ChatSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }  // Adds createdAt and updatedAt fields
);

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);

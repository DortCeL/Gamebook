import mongoose, { Document, Types } from "mongoose";

export interface IFriendship extends Document {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const friendshipSchema = new mongoose.Schema<IFriendship>({
  requester: { type: Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });

// prevent duplicate requests between same two users
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export const Friendship = mongoose.model('Friendship', friendshipSchema);
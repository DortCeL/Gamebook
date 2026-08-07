import mongoose, { Document, Types } from "mongoose";

/** 1-on-1 chat — exactly two users in `participants`. */
export interface IConversation extends Document {
	participants: [Types.ObjectId, Types.ObjectId];
	lastMessage?: Types.ObjectId;
	lastMessageAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const conversationSchema = new mongoose.Schema<IConversation>(
	{
		participants: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			],
			validate: {
				validator: (value: Types.ObjectId[]) => value.length === 2,
				message: "A conversation must have exactly 2 users.",
			},
		},
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		lastMessageAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);

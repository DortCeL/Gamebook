import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
	conversation: string;
	sender: string;
	content: string;
	deliveredAt?: Date | null;
	readAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const messageSchema = new mongoose.Schema(
	{
		conversation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
			index: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		deliveredAt: {
			type: Date,
			default: null,
		},
		readAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);

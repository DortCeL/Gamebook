import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
	sender: Types.ObjectId;
	receiver: Types.ObjectId;
	text: string;
	createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
	{
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
		text: { type: String, required: true, trim: true },
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

export const Message = model<IMessage>("Message", messageSchema);

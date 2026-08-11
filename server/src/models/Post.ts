import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
	author: Types.ObjectId;
	text: string;
	visibility: "public" | "friends";
	createdAt: Date;
	updatedAt: Date;
}

const postSchema = new Schema<IPost>(
	{
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		text: { type: String, required: true, trim: true },
		visibility: {
			type: String,
			enum: ["public", "friends"],
			default: "public",
		},
	},
	{ timestamps: true },
);

export const Post = model<IPost>("Post", postSchema);

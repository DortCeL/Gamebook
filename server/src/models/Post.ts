import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
	author: Types.ObjectId;
	type: "screenshot" | "review" | "text";
	// game?: Types.ObjectId;
	game?: string;
	content?: string;
	images?: string[];
	visibility: "public" | "friends";
	createdAt: Date;
	updatedAt: Date;
}

const postSchema = new Schema<IPost>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: ["screenshot", "review", "text"],
			required: true,
			default: "text",
		},
		game: {
			// type: Schema.Types.ObjectId,
			// ref: "Game",
			// default: null,
			type: String,
		},
		content: {
			type: String,
			trim: true,
			default: "",
		},
		images: {
			type: [String],
			default: [],
		},
		visibility: {
			type: String,
			enum: ["public", "friends"],
			default: "public",
		},
	},
	{
		timestamps: true, // Automatically manages `createdAt` and `updatedAt`
	},
);

export const Post = model<IPost>("Post", postSchema);

import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
	post: Types.ObjectId;
	author: Types.ObjectId;
	content: string;
	parentComment?: Types.ObjectId; // Null for top-level comments, populated if it's a reply
	createdAt: Date;
	updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
	{
		post: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			required: true,
			index: true, // Speeds up fetching comments for a specific post
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		parentComment: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
			index: true, // Speeds up fetching replies for a specific comment
		},
	},
	{
		timestamps: true,
	},
);

export const Comment = model<IComment>("Comment", commentSchema);

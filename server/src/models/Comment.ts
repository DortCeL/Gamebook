import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
	post: Types.ObjectId;
	author: Types.ObjectId;
	text: string;
	parent: Types.ObjectId | null;
	createdAt: Date;
	updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
	{
		post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		text: { type: String, required: true, trim: true },
		parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
	},
	{ timestamps: true },
);

export const Comment = model<IComment>("Comment", commentSchema);

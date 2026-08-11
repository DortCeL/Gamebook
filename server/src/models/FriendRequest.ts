import { Schema, model, Document, Types } from "mongoose";

export interface IFriendRequest extends Document {
	from: Types.ObjectId;
	to: Types.ObjectId;
	status: "pending" | "accepted";
	createdAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
	{
		from: { type: Schema.Types.ObjectId, ref: "User", required: true },
		to: { type: Schema.Types.ObjectId, ref: "User", required: true },
		status: {
			type: String,
			enum: ["pending", "accepted"],
			default: "pending",
		},
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

export const FriendRequest = model<IFriendRequest>(
	"FriendRequest",
	friendRequestSchema,
);

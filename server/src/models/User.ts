import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
	name: string;
	gamertag: string;
	email: string;
	password: string;
	avatar?: string;
	friends: Types.ObjectId[];
	createdAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true, trim: true },
		gamertag: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true, select: false },
		avatar: { type: String, default: "" },
		friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

export default model<IUser>("User", userSchema);

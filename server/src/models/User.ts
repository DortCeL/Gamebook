import { Schema, model, Document } from "mongoose";
import { Post } from "./Post.js";

export interface IUser extends Document {
	name: string;
	gamertag: string;
	avatarUrl?: string;
	email: string;
	password: string;
	role: "user" | "admin";
	createdAt: Date;
	updatedAt: Date;
	bio: string;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		gamertag: {
			type: String,
			required: true,
			unique: true,
		},

		avatarUrl: {
			type: String,
		},

		bio: {
			type: String,
		},

		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},

		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{
		timestamps: true,
	},
);

// runs when i do: const user = await User.findById(id); await user.deleteOne();
userSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		const userId = this._id;

		await Post.deleteMany({ author: userId });
	},
);

export default model<IUser>("User", userSchema);

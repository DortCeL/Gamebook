import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose, { Types } from "mongoose";
import { connectDB } from "./config/index.js";
import User from "./models/User.js";
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";
import { FriendRequest } from "./models/FriendRequest.js";
import { Message } from "./models/Message.js";

const PASSWORD = "password123";

// date helper so the feed and chat look like they happened over a few days
function ago(hours: number) {
	return new Date(Date.now() - hours * 60 * 60 * 1000);
}

const ids = {
	alif: new Types.ObjectId(),
	nadia: new Types.ObjectId(),
	rafi: new Types.ObjectId(),
	tasnim: new Types.ObjectId(),
	zayan: new Types.ObjectId(),
	mehrab: new Types.ObjectId(),
};

// accepted friendships (both sides get each other in their friends array)
const friendships: [Types.ObjectId, Types.ObjectId][] = [
	[ids.alif, ids.nadia],
	[ids.alif, ids.rafi],
	[ids.alif, ids.tasnim],
	[ids.nadia, ids.rafi],
	[ids.tasnim, ids.zayan],
];

function friendsOf(id: Types.ObjectId) {
	return friendships
		.filter(([a, b]) => a.equals(id) || b.equals(id))
		.map(([a, b]) => (a.equals(id) ? b : a));
}

async function seed() {
	await connectDB();

	console.log("Clearing old data...");
	await Promise.all([
		User.deleteMany({}),
		Post.deleteMany({}),
		Comment.deleteMany({}),
		FriendRequest.deleteMany({}),
		Message.deleteMany({}),
	]);

	const hashed = await bcrypt.hash(PASSWORD, 10);

	const users = [
		{ _id: ids.alif, name: "Alif Rahman", gamertag: "alif", email: "alif@gamebook.dev" },
		{ _id: ids.nadia, name: "Nadia Chowdhury", gamertag: "nadia_snipes", email: "nadia@gamebook.dev" },
		{ _id: ids.rafi, name: "Rafi Hasan", gamertag: "rafi.exe", email: "rafi@gamebook.dev" },
		{ _id: ids.tasnim, name: "Tasnim Akter", gamertag: "tasnimGG", email: "tasnim@gamebook.dev" },
		{ _id: ids.zayan, name: "Zayan Karim", gamertag: "zayan_tank", email: "zayan@gamebook.dev" },
		{ _id: ids.mehrab, name: "Mehrab Islam", gamertag: "mehrab404", email: "mehrab@gamebook.dev" },
	].map((u, i) => ({
		...u,
		password: hashed,
		friends: friendsOf(u._id),
		createdAt: ago(24 * 30 - i * 24),
	}));

	await User.insertMany(users);

	// pending requests so both "Accept Request" and "Awaiting confirmation" show up for alif
	await FriendRequest.insertMany([
		{ from: ids.zayan, to: ids.alif, status: "pending", createdAt: ago(5) },
		{ from: ids.alif, to: ids.mehrab, status: "pending", createdAt: ago(3) },
	]);

	// more than 10 posts so the feed's second page (infinite scroll) gets used
	const posts = [
		{ author: ids.nadia, text: "Finally hit Immortal in Valorant after 3 seasons of hardstuck Ascendant. Jett diff.", visibility: "public", hours: 1 },
		{ author: ids.rafi, text: "Anyone up for Helldivers 2 tonight? Need 2 more for a level 9 drop.", visibility: "friends", hours: 2 },
		{ author: ids.alif, text: "Elden Ring DLC took me 60 hours. Messmer was the best boss fight I've played in years.", visibility: "public", hours: 4 },
		{ author: ids.tasnim, text: "Hot take: Stardew Valley is the most relaxing game ever made and I will not be taking questions.", visibility: "public", hours: 6 },
		{ author: ids.zayan, text: "Main tanking in Overwatch 2 is pain. Every game my team expects me to 1v5.", visibility: "public", hours: 9 },
		{ author: ids.alif, text: "Setting up a weekly Minecraft server for friends. Survival, no mods. Drop your gamertag below.", visibility: "friends", hours: 12 },
		{ author: ids.mehrab, text: "Just built my first PC. RTX 4070 + Ryzen 7. Cyberpunk on ultra finally runs smooth.", visibility: "public", hours: 15 },
		{ author: ids.nadia, text: "Reminder that the AWP is a lifestyle, not a weapon.", visibility: "public", hours: 20 },
		{ author: ids.rafi, text: "Baldur's Gate 3 honour mode run ended at the Githyanki creche. I'm going to lie down.", visibility: "public", hours: 26 },
		{ author: ids.tasnim, text: "Who wants to duo in Fortnite this weekend? I build, you shoot.", visibility: "friends", hours: 30 },
		{ author: ids.alif, text: "Hollow Knight: Silksong is out and my sleep schedule is gone.", visibility: "public", hours: 40 },
		{ author: ids.zayan, text: "FC 25 Ultimate Team is a casino with a football skin. Still playing it every night though.", visibility: "public", hours: 48 },
		{ author: ids.nadia, text: "Streaming ranked tonight at 9 PM. Come hang out.", visibility: "friends", hours: 60 },
		{ author: ids.mehrab, text: "What's a good first JRPG? Thinking Persona 5 Royal.", visibility: "public", hours: 72 },
	];

	const postDocs = await Post.insertMany(
		posts.map((p, i) => ({
			_id: new Types.ObjectId(),
			author: p.author,
			text: p.text,
			visibility: p.visibility,
			createdAt: ago(p.hours),
			updatedAt: ago(p.hours),
		})),
	);
	const post = (i: number) => postDocs[i]!._id;

	// top-level comments first, then replies that point at them
	const c1 = new Types.ObjectId();
	const c2 = new Types.ObjectId();
	const c3 = new Types.ObjectId();
	const c4 = new Types.ObjectId();

	await Comment.insertMany([
		{ _id: c1, post: post(0), author: ids.alif, text: "Congrats! Carry me next.", parent: null, createdAt: ago(0.8) },
		{ post: post(0), author: ids.nadia, text: "Only if you stop instalocking Reyna.", parent: c1, createdAt: ago(0.7) },
		{ post: post(0), author: ids.rafi, text: "Immortal is crazy. GG.", parent: null, createdAt: ago(0.5) },

		{ _id: c2, post: post(2), author: ids.rafi, text: "Messmer took me 40 tries. Worth it.", parent: null, createdAt: ago(3.5) },
		{ post: post(2), author: ids.alif, text: "40 is honestly good. I stopped counting at 60.", parent: c2, createdAt: ago(3) },
		{ post: post(2), author: ids.tasnim, text: "Too scared to start the DLC tbh.", parent: null, createdAt: ago(2.5) },

		{ _id: c3, post: post(5), author: ids.nadia, text: "nadia_snipes. I'll bring the diamonds.", parent: null, createdAt: ago(11) },
		{ post: post(5), author: ids.tasnim, text: "tasnimGG, count me in!", parent: null, createdAt: ago(10.5) },
		{ post: post(5), author: ids.alif, text: "Added both of you. Server IP coming in chat.", parent: c3, createdAt: ago(10) },

		{ _id: c4, post: post(13), author: ids.tasnim, text: "Persona 5 Royal for sure. Best soundtrack ever.", parent: null, createdAt: ago(70) },
		{ post: post(13), author: ids.mehrab, text: "Buying it tonight, thanks!", parent: c4, createdAt: ago(69) },
		{ post: post(13), author: ids.zayan, text: "Dragon Quest XI is also a great starter.", parent: null, createdAt: ago(68) },
	].map((c) => ({ ...c, updatedAt: c.createdAt })));

	await Message.insertMany([
		{ sender: ids.nadia, receiver: ids.alif, text: "yo you on tonight?", createdAt: ago(2) },
		{ sender: ids.alif, receiver: ids.nadia, text: "yeah after 10. ranked?", createdAt: ago(1.9) },
		{ sender: ids.nadia, receiver: ids.alif, text: "ranked. and no Reyna this time", createdAt: ago(1.8) },
		{ sender: ids.alif, receiver: ids.nadia, text: "no promises", createdAt: ago(1.7) },
		{ sender: ids.nadia, receiver: ids.alif, text: "i will uninstall your game", createdAt: ago(1.6) },
		{ sender: ids.rafi, receiver: ids.alif, text: "helldivers at 9?", createdAt: ago(5) },
		{ sender: ids.alif, receiver: ids.rafi, text: "down. bring the orbital laser", createdAt: ago(4.8) },
		{ sender: ids.tasnim, receiver: ids.alif, text: "what's the minecraft server ip?", createdAt: ago(9) },
	]);

	console.log("Seed complete.");
	console.log(`  ${users.length} users, ${posts.length} posts, 12 comments, 8 messages, 2 pending friend requests`);
	console.log(`  Log in with any seeded email (e.g. alif@gamebook.dev), password: ${PASSWORD}`);
}

seed()
	.catch((err) => {
		console.error("Seed failed:", err);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());

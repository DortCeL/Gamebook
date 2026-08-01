import type { IAuthor } from "../../types";

interface getAuthorOutput {
	_id?: string;
	gamertag: string;
	name: string;
	avatarUrl: string;
}

// get the author of a post
export function getAuthor(author: string | IAuthor): getAuthorOutput {
	// if the author is a string, return the author id
	if (typeof author === "string") {
		return {
			_id: author,
			gamertag: "unknown",
			name: "unknown",
			avatarUrl: "?",
		};
	}
	// if the author is an object, return the author details
	return {
		_id: author._id,
		gamertag: author.gamertag || "unknown",
		name: author.name || "unknown",
		avatarUrl: author.avatarUrl || "?",
	};
}

// get the author id of a post
export function getAuthorId(author: string | IAuthor): string | null {
	if (typeof author === "string") return author;
	return author._id ?? null;
}

// format a date
export function formatDate(date: string): string {
	return new Date(date).toLocaleString();
}

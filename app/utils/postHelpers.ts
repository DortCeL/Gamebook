import type { IAuthor } from "../../types";

interface getAuthorOutput {	gamertag: string,
	name: string,
	avatarUrl: string
}

export function getAuthor(author: string | IAuthor): getAuthorOutput {
	if (typeof author === "string") {
		return (
			{
				gamertag: "unknown",
				name: "unknown",
				avatarUrl: "?",
			}
		)
	};
	return (
		{
			gamertag: author.gamertag || "unknown",
			name: author.name || "unknown",
			avatarUrl: author.avatarUrl || "?",
		} 
	);
}


export function formatDate(date: string): string {
	return new Date(date).toLocaleString();
}

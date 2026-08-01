import { Link } from "react-router";
import type { IAuthor } from "../../types";
import { Avatar } from "~/components/Avatar";
import { getAuthor, getAuthorId } from "~/utils/postHelpers";

interface AuthorLinkProps {
	author: string | IAuthor;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	showGamertag?: boolean;
	className?: string;
	avatarClassName?: string;
	nameClassName?: string;
	layout?: "row" | "column";
}

// a link to the author's profile
export default function AuthorLink({
	author,
	size = "md",
	showGamertag = true,
	className = "",
	avatarClassName = "",
	nameClassName = "",
	layout = "row",
}: AuthorLinkProps) {
	const authorId = getAuthorId(author);
	const info = getAuthor(author);

	if (!authorId) {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<Avatar
					src={info.avatarUrl}
					alt={info.name}
					fallback={info.name}
					size={size}
					className={avatarClassName}
				/>
				<div className={layout === "column" ? "flex flex-col" : ""}>
					<span className={nameClassName}>{info.name}</span>
					{showGamertag && (
						<span className="text-xs text-gray-500">@{info.gamertag}</span>
					)}
				</div>
			</div>
		);
	}

	return (
		<Link
			to={`/users/${authorId}`}
			onClick={(e) => e.stopPropagation()}
			className={`flex items-center gap-2 hover:opacity-80 transition ${className}`}
		>
			<Avatar
				src={info.avatarUrl}
				alt={info.name}
				fallback={info.name}
				size={size}
				className={avatarClassName}
			/>
			<div className={layout === "column" ? "flex flex-col min-w-0" : "min-w-0"}>
				<span className={`truncate ${nameClassName}`}>{info.name}</span>
				{showGamertag && (
					<span className="text-xs text-gray-500 truncate">@{info.gamertag}</span>
				)}
			</div>
		</Link>
	);
}

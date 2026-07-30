import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string; // e.g. full name or any text
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number; // number = pixel size
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-2xl",
  xl: "w-24 h-24 text-4xl",
};

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className = "",
  onClick,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Determine size class
  const sizeClass = typeof size === "number"
    ? `w-${size} h-${size}` // dynamic Tailwind might not work for custom numbers; better to use inline style if needed
    : sizeMap[size] || sizeMap.md;

  // Generate fallback text (initials)
  let fallbackText = "?";
  if (fallback) {
    const parts = fallback.trim().split(/\s+/);
    if (parts.length === 1) {
      fallbackText = parts[0][0].toUpperCase();
    } else {
      fallbackText = parts
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  } else if (alt && alt !== "Avatar") {
    fallbackText = alt[0].toUpperCase();
  }

  // Merge classes manually
  const mergedClass = [
    "relative shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-200",
    sizeClass,
    className,
    onClick ? "cursor-pointer hover:opacity-80 transition" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={mergedClass} onClick={onClick}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : null}
      {(!src || imgError) && (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {fallbackText}
        </div>
      )}
    </div>
  );
}
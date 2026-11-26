export const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);

  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const lastPart = parts.at(-1);
  if (lastPart == null) {
    return "";
  }

  return `${parts[0][0]}${lastPart[0]}`.toUpperCase();
};

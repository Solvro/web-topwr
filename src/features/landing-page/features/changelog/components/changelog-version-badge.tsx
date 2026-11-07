export function ChangelogVersionBadge({
  versionName,
}: {
  versionName: string;
}) {
  return (
    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 font-mono text-xs font-semibold">
      v{versionName}
    </span>
  );
}

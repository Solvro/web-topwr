export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-12">
      <h2 className="mb-4 max-w-2xl text-4xl font-medium sm:text-5xl">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-xl text-lg">{description}</p>
    </header>
  );
}

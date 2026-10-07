import { Logo } from "@/components/presentation/logo";

export function FooterBrand() {
  return (
    <div>
      <Logo variant="white" className="mb-3 h-7" />
      <p className="max-w-56 text-sm">
        Aplikacja, która porządkuje studencki dzień na Politechnice
        Wrocławskiej. Life made easy.
      </p>
    </div>
  );
}

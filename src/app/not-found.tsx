import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col justify-center">
        <h2 className="text-center">404</h2>
        <p className="text-center">Nie znaleziono podanej strony</p>
        <Link className="mt-8 text-center underline" href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}

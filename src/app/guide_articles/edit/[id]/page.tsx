// import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: number } }) {
  const { id } = params;

  return <div>edit/{id}</div>;
}

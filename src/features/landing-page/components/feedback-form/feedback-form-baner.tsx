import { MessageSquare } from "lucide-react";

export function FeedbackFormBaner() {
  return (
    <aside className="from-gradient-1 to-gradient-2 relative isolate flex min-h-[360px] flex-col justify-center overflow-hidden bg-gradient-to-br px-9 py-10 text-white sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 -z-10 size-56 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 -z-10 size-52 rounded-full bg-white/10"
      />
      <MessageSquare aria-hidden="true" className="mb-5 size-12 stroke-[1.7]" />
      <h2 className="max-w-xs text-3xl leading-tight font-bold">
        Twoja opinia
        <br />
        ma znaczenie
      </h2>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/95">
        Każdy feedback pomaga nam rozwijać ToPWR szybciej. Piszesz — my czytamy
        i działamy.
      </p>
    </aside>
  );
}

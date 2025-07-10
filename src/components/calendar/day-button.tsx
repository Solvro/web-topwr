interface Props {
  day: number;
  onClick: (day: number) => void;
}

export function DayButton({ day, onClick }: Props) {
  const isCurrentDay = day === new Date().getDate();
  return (
    <button
      className={`flex h-32 cursor-pointer items-center justify-center border ${
        isCurrentDay ? "bg-blue-500 text-white" : "bg-white text-black"
      }`}
      onClick={() => {
        onClick(day);
      }}
    >
      {day}
    </button>
  );
}

import type { Note } from "@/lib/rooftop/types";

interface RecordFrequencyProps {
  notes: Note[];
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const NOW_TS = Date.now();

export function RecordFrequency({ notes }: RecordFrequencyProps) {
  const cutoff = NOW_TS - THIRTY_DAYS_MS;
  const recentCount = notes.filter((note) => {
    const timestamp = new Date(note.createdAt).getTime();
    return Number.isFinite(timestamp) && timestamp >= cutoff;
  }).length;

  return (
    <p className="text-[11px] text-[#a4937d] sm:text-xs">
      过去 30 天，我在 Rooftop 记录了 {recentCount} 次。
    </p>
  );
}

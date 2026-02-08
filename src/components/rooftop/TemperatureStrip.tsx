import Link from "next/link";
import type { Note } from "@/lib/rooftop/types";

interface TemperatureStripProps {
  notes: Note[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getIntensity(note: Note) {
  const contentLength = note.content.trim().length;
  const imagesCount = note.images?.length ?? 0;
  return clamp(contentLength / 200 + imagesCount * 0.15, 0, 1);
}

function getSummary(note: Note) {
  return note.content.replace(/\s+/g, " ").trim().slice(0, 20);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
}

function renderSegments(notes: Note[], limit: number) {
  const latest = notes.slice(0, limit);

  return Array.from({ length: limit }, (_, index) => {
    const note = latest[index];
    if (!note) {
      return (
        <span
          key={`empty-${index}`}
          className="h-2 flex-1 rounded-full bg-[#d8c8b2]/30 md:h-2.5"
          aria-hidden="true"
        />
      );
    }

    const intensity = getIntensity(note);
    const opacity = 0.18 + intensity * 0.7;
    const tooltip = `${formatDate(note.createdAt)} · ${getSummary(note)}`;

    return (
      <Link
        key={note.id}
        href={`/rooftop/p/${note.id}`}
        title={tooltip}
        className="group h-2 flex-1 rounded-full transition-transform duration-200 hover:translate-y-[-1px] md:h-2.5"
        style={{
          backgroundColor: `rgba(178, 131, 84, ${opacity})`,
        }}
        aria-label={tooltip}
      />
    );
  });
}

export function TemperatureStrip({ notes }: TemperatureStripProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 md:hidden">
        {renderSegments(notes, 14)}
      </div>
      <div className="hidden items-center gap-1.5 md:flex">
        {renderSegments(notes, 20)}
      </div>
    </div>
  );
}

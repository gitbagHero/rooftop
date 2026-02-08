import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecordFrequency } from "@/components/rooftop/RecordFrequency";
import { TemperatureStrip } from "@/components/rooftop/TemperatureStrip";
import type { Note } from "@/lib/rooftop/types";

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl: string;
  notes: Note[];
}

export function ProfileHeader({
  name,
  bio,
  avatarUrl,
  notes,
}: ProfileHeaderProps) {
  return (
    <section className="relative min-h-60 overflow-hidden rounded-3xl bg-[#f9f2e7]/80 sm:min-h-64">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,246,236,0.85)_0%,rgba(245,235,219,0.78)_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(130,106,79,0.45)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="relative z-10 flex h-full flex-col gap-4 p-5 sm:gap-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={name}
              className="size-14 rounded-full object-cover ring-2 ring-[#f6efe3] sm:size-16"
            />
            <div>
              <h1 className="text-[22px] font-medium tracking-tight text-[#514538] sm:text-[26px]">
                {name}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#6f604e] sm:text-base sm:leading-8">
                {bio}
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full border border-[#ddcfba] bg-[#f2e8d8] text-[#6a5846] shadow-none hover:bg-[#ebdeca]"
          >
            <Link href="/rooftop/new">
              <Plus />
              新建分享
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-[#e7dac8]/70 bg-[#faf5eb]/70 px-3 py-2.5 sm:px-4 sm:py-3">
          <TemperatureStrip notes={notes} />
          <div className="mt-2">
            <RecordFrequency notes={notes} />
          </div>
        </div>

        <p className="text-[11px] text-[#a08e78] sm:text-xs">
          Rooftop · 日记 / 动态 / 随手分享
        </p>
      </div>
    </section>
  );
}

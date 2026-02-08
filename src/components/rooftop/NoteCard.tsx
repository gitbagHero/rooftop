"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGrid } from "@/components/rooftop/ImageGrid";
import { LikeBar } from "@/components/rooftop/LikeBar";
import { MarkdownContent } from "@/components/rooftop/MarkdownContent";
import type { Note } from "@/lib/rooftop/types";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
}

function formatTime(iso: string) {
  const now = Date.now();
  const ts = new Date(iso).getTime();
  const diff = now - ts;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))} 分钟前`;
  if (diff < 24 * hour) return `${Math.floor(diff / hour)} 小时前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}

export function NoteCard({ note }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const needCollapse = note.content.length > 180;
  const imageCount = note.images.length;
  const lineCount = note.content.split(/\n+/).filter((line) => line.trim().length > 0).length;
  const isTextOnly = imageCount === 0;
  const isSingleImage = imageCount === 1;
  const isGallery = imageCount >= 3;
  const isQuoteCard =
    isTextOnly &&
    (note.content.trim().length < 30 ||
      (lineCount <= 2 && note.content.trim().length < 60));

  const displayContent = useMemo(() => {
    if (expanded || !needCollapse) return note.content;
    return `${note.content.slice(0, 180)}...`;
  }, [expanded, needCollapse, note.content]);

  const imageUrls = useMemo(
    () =>
      [...note.images]
        .sort((a, b) => a.order - b.order)
        .map((image) => image.url)
        .slice(0, 9),
    [note.images]
  );

  return (
    <Card
      className={`rounded-2xl border py-0 shadow-[0_6px_18px_rgba(103,83,59,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(103,83,59,0.12)] ${
        isQuoteCard
          ? "border-[#e3d5c1] bg-[#f6f1e8] md:mx-3"
          : ""
      } ${
        isTextOnly && !isQuoteCard
          ? "border-[#ebe1d3] bg-[#fbf9f4] md:mx-2"
          : isSingleImage
            ? "border-[#e8dccb] bg-[#faf7f1] md:mx-1"
            : isGallery
              ? "border-[#e6d9c6] bg-[#f9f5ee]"
              : "border-[#e8dccb] bg-[#faf7f1]"
      }`}
    >
      <CardContent className={`${isTextOnly ? "p-5 sm:p-6" : "p-4 sm:p-5"}`}>
        <div className="mb-2.5 text-[11px] text-[#a08d74] sm:text-xs">
          {formatTime(note.createdAt)}
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div>
            <MarkdownContent
              markdown={displayContent}
              className={cn(
                isQuoteCard
                  ? "px-2 py-3 text-center text-[23px] leading-relaxed sm:text-[26px]"
                  : "text-[15px] leading-loose sm:text-base"
              )}
            />
            {needCollapse && (
              <button
                type="button"
                className={cn(
                  "mt-3 text-xs text-[#ab977f] transition-colors hover:text-[#7a6751]",
                  isQuoteCard && "block mx-auto"
                )}
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "收起" : "Show more"}
              </button>
            )}
          </div>

          <ImageGrid images={imageUrls} />

          <div className="flex items-center justify-between border-t border-[#ece2d3] pt-2.5">
            <LikeBar
              stats={{
                likes: note.likes,
                comments: note.comments,
                shares: note.shares,
              }}
            />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2.5 text-xs text-[#9c876e] hover:bg-[#f0e8dc] hover:text-[#715d46]"
            >
              <Link href={`/rooftop/p/${note.id}`}>
                详情
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

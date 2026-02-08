"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGridProps {
  images?: string[];
}

function getGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2";
  if (count === 4) return "grid-cols-2";
  if (count === 6) return "grid-cols-2 sm:grid-cols-3";
  return "grid-cols-3";
}

function getItemClass(index: number, count: number) {
  if (count === 1) return "aspect-[4/5] sm:aspect-[16/10]";
  if (count === 3 && index === 0) return "col-span-2 aspect-[16/10]";
  if (count === 4 && index === 0) return "col-span-2 aspect-[16/10]";
  return "aspect-square";
}

function getPhotoOffsetClass(index: number, count: number) {
  if (count <= 1) return "";
  if (index % 3 === 0) return "rotate-[-0.5deg] translate-y-[1px]";
  if (index % 3 === 1) return "rotate-[0.45deg] translate-y-[-1px]";
  return "rotate-[-0.25deg]";
}

export function ImageGrid({ images }: ImageGridProps) {
  const safeImages = (images ?? []).slice(0, 9);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  if (safeImages.length === 0) return null;

  return (
    <>
      <div className={cn("grid gap-2.5 sm:gap-3", getGridClass(safeImages.length))}>
        {safeImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            className={cn(
              "group relative overflow-hidden rounded-[18px] border border-[#e8ddcc] bg-[#f8efe2] shadow-[0_1px_5px_rgba(111,91,65,0.07)] transition-transform duration-300",
              getItemClass(index, safeImages.length),
              getPhotoOffsetClass(index, safeImages.length)
            )}
            onClick={() => setSelectedIndex(index)}
          >
            {failed[index] ? (
              <div className="flex h-full w-full items-center justify-center bg-[#f2e6d4] text-xs text-[#9a8268]">
                图片加载失败
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`图片 ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] group-hover:rotate-[0deg]"
                onError={() => {
                  setFailed((prev) => ({ ...prev, [index]: true }));
                }}
              />
            )}
          </button>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-[min(95vw,960px)] border-[#e1d4be] bg-[#fcf8f2] p-2 sm:p-3">
          <DialogTitle className="sr-only">图片预览</DialogTitle>
          {selectedIndex !== null && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={safeImages[selectedIndex]}
              alt="预览图片"
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

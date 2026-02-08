import { Heart, MessageCircle, Share2 } from "lucide-react";

interface LikeStats {
  likes: number;
  comments: number;
  shares: number;
}

interface LikeBarProps {
  stats: LikeStats;
  className?: string;
}

const itemClass =
  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] text-[#ac9980] transition-colors hover:text-[#7f6a52]";

export function LikeBar({ stats, className }: LikeBarProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <div className={itemClass}>
          <Heart className="size-3.5" />
          <span>{stats.likes}</span>
        </div>
        <div className={itemClass}>
          <MessageCircle className="size-3.5" />
          <span>{stats.comments}</span>
        </div>
        <div className={itemClass}>
          <Share2 className="size-3.5" />
          <span>{stats.shares}</span>
        </div>
      </div>
    </div>
  );
}

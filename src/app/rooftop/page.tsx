"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/rooftop/ProfileHeader";
import { NoteCard } from "@/components/rooftop/NoteCard";
import { fetchNotes } from "@/lib/rooftop/api";
import type { Note } from "@/lib/rooftop/types";

const avatarUrl = "https://picsum.photos/seed/rooftop-avatar/240/240";

export default function RooftopFeedPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchNotes();
        if (canceled) return;
        setNotes(data);
      } catch (err) {
        if (canceled) return;
        setError(err instanceof Error ? err.message : "加载失败，请稍后重试。");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [retryCount]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] text-[#4d4236]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fdfaf4_0%,#f6eddf_62%,#f2e6d6_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,rgba(124,100,74,0.6)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <ProfileHeader
          name="gitbag"
          bio="记录今天，分享随手拍和脑内碎片。"
          avatarUrl={avatarUrl}
          notes={notes}
        />

        <section className="mt-7 space-y-4 sm:mt-9 sm:space-y-6">
          {loading && (
            <Card className="rounded-2xl border-[#ece1d1] bg-[#fbf8f2] py-0 shadow-[0_3px_8px_rgba(111,92,69,0.06)]">
              <CardContent className="p-6 text-center text-[#7d6b57]">正在加载记录...</CardContent>
            </Card>
          )}

          {!loading && error && (
            <Card className="rounded-2xl border-[#ead9c6] bg-[#fbf8f2] py-0 shadow-[0_3px_8px_rgba(111,92,69,0.06)]">
              <CardContent className="space-y-3 p-6 text-center">
                <p className="text-sm text-[#8e6c50]">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#ddcfba] bg-[#f5ecdd] text-[#6a5846] hover:bg-[#efe3d0]"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  重试
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && notes.length === 0 && (
            <Card className="rounded-2xl border-[#ece1d1] bg-[#fbf8f2] py-0 shadow-[0_3px_8px_rgba(111,92,69,0.06)]">
              <CardContent className="p-6 text-center text-[#7d6b57]">暂时还没有分享内容。</CardContent>
            </Card>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.72,
                    delay: index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -0.5 }}
                >
                  <NoteCard note={note} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

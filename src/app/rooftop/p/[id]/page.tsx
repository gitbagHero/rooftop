"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageGrid } from "@/components/rooftop/ImageGrid";
import { LikeBar } from "@/components/rooftop/LikeBar";
import { MarkdownContent } from "@/components/rooftop/MarkdownContent";
import { deleteNote, fetchNote } from "@/lib/rooftop/api";
import type { Note } from "@/lib/rooftop/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RooftopDetailPage() {
  const tokenStorageKey = "rooftop_admin_token";
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(tokenStorageKey) ?? "";
  });
  const [rememberToken, setRememberToken] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(tokenStorageKey));
  });

  useEffect(() => {
    if (!id) return;
    let canceled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchNote(id);
        if (canceled) return;
        setNote(data);
      } catch (err) {
        if (canceled) return;
        setNote(null);
        setError(err instanceof Error ? err.message : "加载失败，请稍后重试。");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id || !note) return;
    if (!adminToken.trim()) {
      setDeleteError("请输入 Admin Token 后再删除。");
      return;
    }
    const confirmed = window.confirm("确认删除这条分享？删除后不可恢复。");
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError("");
    try {
      await deleteNote(id, adminToken.trim());
      if (rememberToken) {
        window.localStorage.setItem(tokenStorageKey, adminToken.trim());
      } else {
        window.localStorage.removeItem(tokenStorageKey);
      }
      router.push("/rooftop");
    } catch (err) {
      const message = err instanceof Error ? err.message : "删除失败，请稍后重试。";
      if (message.includes("Unauthorized")) {
        setDeleteError("无权限：Admin Token 错误。");
      } else {
        setDeleteError(message);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] text-[#4f4337]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fdfaf4_0%,#f6eddf_62%,#f2e6d6_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,rgba(124,100,74,0.6)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-[960px] px-4 py-6 sm:px-6 sm:py-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 rounded-full text-[#7c6852] hover:bg-[#efe5d6] hover:text-[#5e4d3b]"
        >
          <Link href="/rooftop">
            <ArrowLeft />
            返回动态流
          </Link>
        </Button>

        {!loading && !note && (
          <Card className="rounded-3xl border-[#e4d8c6] bg-[#faf7f0] py-0">
            <CardContent className="p-6 text-[#7f6c56]">
              {error === "Note not found"
                ? "这条分享不存在或已被删除。"
                : error || "这条分享不存在或已被删除。"}
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="rounded-3xl border-[#e2d5c2] bg-[#faf7f0] py-0 shadow-[0_10px_24px_rgba(107,87,62,0.10)]">
            <CardContent className="p-6 text-[#7f6c56]">正在加载详情...</CardContent>
          </Card>
        )}

        {note && (
          <Card className="rounded-3xl border-[#e2d5c2] bg-[#faf7f0] py-0 shadow-[0_10px_24px_rgba(107,87,62,0.10)]">
            <CardContent className="space-y-6 p-5 sm:p-8">
              <div className="space-y-2">
                <p className="text-sm text-[#8d7962]">{formatTime(note.createdAt)}</p>
                <MarkdownContent markdown={note.content} className="text-base sm:text-lg" />
              </div>

              <ImageGrid
                images={[...note.images].sort((a, b) => a.order - b.order).map((img) => img.url)}
              />

              <div className="border-t border-[#e8dccb] pt-2">
                <LikeBar
                  stats={{
                    likes: note.likes,
                    comments: note.comments,
                    shares: note.shares,
                  }}
                />
              </div>

              <div className="border-t border-[#e8dccb] pt-4">
                <p className="mb-2 text-xs text-[#9a8771]">管理员操作</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="password"
                    value={adminToken}
                    onChange={(event) => setAdminToken(event.target.value)}
                    placeholder="输入 Admin Token 以删除"
                    className="border-[#dfd1bc] bg-[#fffdf9] text-[#4e4338] placeholder:text-[#b3a08b]"
                  />
                  <Button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-[#a55c45] text-[#fff8ef] hover:bg-[#8f4d39]"
                  >
                    <Trash2 />
                    {deleting ? "删除中..." : "删除这条分享"}
                  </Button>
                </div>
                <label className="mt-2 inline-flex items-center gap-2 text-xs text-[#8f7a63]">
                  <input
                    type="checkbox"
                    checked={rememberToken}
                    onChange={(event) => setRememberToken(event.target.checked)}
                    className="size-3.5 rounded border-[#c9b8a0] text-[#8f6f4f]"
                  />
                  记住我的 Admin Token
                </label>
                {deleteError && <p className="mt-2 text-sm text-[#b24a36]">{deleteError}</p>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

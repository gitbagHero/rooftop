"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageUp, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNote, uploadImages } from "@/lib/rooftop/api";

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function NewRooftopNotePage() {
  const maxImagesPerNote = 9;
  const maxContentLength = 10000;
  const tokenStorageKey = "rooftop_admin_token";
  const router = useRouter();
  const [content, setContent] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(tokenStorageKey) ?? "";
  });
  const [rememberToken, setRememberToken] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(tokenStorageKey));
  });

  const canSubmit = content.trim().length > 0 && !submitting && !uploading;
  const totalImageCount = images.length + selectedFiles.length;
  const remaining = useMemo(
    () => maxContentLength - content.length,
    [content.length, maxContentLength]
  );

  useEffect(() => {
    const localUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(localUrls);
    return () => {
      localUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (!isValidUrl(url)) {
      setError("请输入有效的图片 URL（http/https）。");
      return;
    }
    if (totalImageCount >= maxImagesPerNote) {
      setError(`最多添加 ${maxImagesPerNote} 张图片。`);
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageInput("");
    setError("");
    setUploadMessage("");
  };

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    if (incoming.length === 0) return;

    const slots = maxImagesPerNote - totalImageCount;
    if (slots <= 0) {
      setError(`最多添加 ${maxImagesPerNote} 张图片。`);
      event.target.value = "";
      return;
    }

    if (incoming.length > slots) {
      setError(`最多还可添加 ${slots} 张图片。`);
    } else {
      setError("");
    }

    setSelectedFiles((prev) => [...prev, ...incoming.slice(0, slots)]);
    setUploadMessage("");
    event.target.value = "";
  };

  const handleUploadSelected = async () => {
    if (selectedFiles.length === 0) {
      setError("请先选择图片文件。");
      return;
    }
    if (!adminToken.trim()) {
      setError("请先输入 Admin Token 再上传图片。");
      return;
    }

    setUploading(true);
    setError("");
    setUploadMessage("");
    try {
      const urls = await uploadImages(selectedFiles, adminToken.trim());
      setImages((prev) => [...prev, ...urls].slice(0, maxImagesPerNote));
      setSelectedFiles([]);
      setUploadMessage(`上传成功：${urls.length} 张图片`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "图片上传失败，请稍后重试。";
      if (message.includes("Unauthorized")) {
        setError("无权限：Admin Token 错误。");
      } else {
        setError(message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) {
      setError("内容不能为空。");
      return;
    }
    if (!adminToken.trim()) {
      setError("请输入 Admin Token。");
      return;
    }
    if (selectedFiles.length > 0) {
      setError("你有未上传的本地图片，请先点击“上传图片”再发布。");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createNote(
        {
          content,
          images,
        },
        adminToken.trim()
      );

      if (rememberToken) {
        window.localStorage.setItem(tokenStorageKey, adminToken.trim());
      } else {
        window.localStorage.removeItem(tokenStorageKey);
      }
      setSuccess("发布成功，正在返回动态流...");
      router.push("/rooftop");
    } catch (err) {
      const message = err instanceof Error ? err.message : "发布失败，请稍后重试。";
      if (message.includes("Unauthorized")) {
        setError("无权限：Admin Token 错误。");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] text-[#4f4337]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fdfaf4_0%,#f6eddf_62%,#f2e6d6_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,rgba(124,100,74,0.6)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-[920px] px-4 py-6 sm:px-6 sm:py-8">
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

        <Card className="rounded-3xl border-[#e2d5c2] bg-[#faf7f0] py-0 shadow-[0_10px_24px_rgba(107,87,62,0.10)]">
          <CardHeader className="space-y-2 border-b border-[#ece0cf] pb-5">
            <CardTitle className="text-2xl text-[#4f4337]">新建分享</CardTitle>
            <p className="text-sm text-[#7f6d59]">写点文字，附上几张图，马上发布到 Rooftop。</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm text-[#6f5e4c]" htmlFor="note-content">
                  文本内容
                </label>
                <Textarea
                  id="note-content"
                  required
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="今天想分享什么？"
                  maxLength={maxContentLength}
                  className="min-h-40 border-[#dfd1bc] bg-[#fffdf9] text-base text-[#4e4338] placeholder:text-[#b3a08b] focus-visible:border-[#cab8a0] focus-visible:ring-[#d8c7b0]/50"
                />
                <p className="text-xs text-[#9a8771]">
                  还可输入 {Math.max(0, remaining)} 字（上限 {maxContentLength}）
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#6f5e4c]" htmlFor="image-files">
                  本地图片上传
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    id="image-files"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleSelectFiles}
                    className="border-[#dfd1bc] bg-[#fffdf9] text-[#4e4338] file:mr-3 file:rounded-md file:border-0 file:bg-[#efe4d2] file:px-2 file:text-[#5e4d3c]"
                  />
                  <Button
                    type="button"
                    onClick={handleUploadSelected}
                    disabled={uploading || selectedFiles.length === 0}
                    variant="secondary"
                    className="border border-[#d8c9b3] bg-[#efe4d2] text-[#5e4d3c] hover:bg-[#e6d9c5]"
                  >
                    {uploading ? <Upload className="animate-pulse" /> : <ImageUp />}
                    {uploading ? "上传中..." : "上传图片"}
                  </Button>
                </div>
                <p className="text-xs text-[#9a8771]">
                  支持 jpg/png/webp/gif，单张 ≤ 5MB，单次最多 9 张。
                </p>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-[#dcccc1] bg-[#f8efe2] shadow-[0_2px_8px_rgba(111,91,65,0.08)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`待上传 ${index + 1}`}
                          className="aspect-square h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label={`移除待上传图片 ${index + 1}`}
                          onClick={() =>
                            setSelectedFiles((prev) =>
                              prev.filter((_, item) => item !== index)
                            )
                          }
                          className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-full bg-[#5d4c3a]/70 text-[#fffaf3] opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <span className="absolute bottom-1 left-1 rounded bg-[#5d4c3a]/70 px-1.5 py-0.5 text-[10px] text-[#fffaf3]">
                          待上传
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#6f5e4c]" htmlFor="image-url">
                  图片 URL（可选）
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="image-url"
                    value={imageInput}
                    onChange={(event) => setImageInput(event.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="border-[#dfd1bc] bg-[#fffdf9] text-[#4e4338] placeholder:text-[#b3a08b]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    variant="secondary"
                    className="border border-[#d8c9b3] bg-[#efe4d2] text-[#5e4d3c] hover:bg-[#e6d9c5]"
                  >
                    <Plus />
                    添加
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {images.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-[#e2d6c4] shadow-[0_2px_8px_rgba(111,91,65,0.08)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`预览 ${index + 1}`}
                          className="aspect-square h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label={`删除图片 ${index + 1}`}
                          onClick={() =>
                            setImages((prev) => prev.filter((_, item) => item !== index))
                          }
                          className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-full bg-[#5d4c3a]/70 text-[#fffaf3] opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#6f5e4c]" htmlFor="admin-token">
                  Admin Token
                </label>
                <Input
                  id="admin-token"
                  type="password"
                  value={adminToken}
                  onChange={(event) => setAdminToken(event.target.value)}
                  placeholder="输入管理员口令"
                  className="border-[#dfd1bc] bg-[#fffdf9] text-[#4e4338] placeholder:text-[#b3a08b]"
                />
                <label className="inline-flex items-center gap-2 text-xs text-[#8f7a63]">
                  <input
                    type="checkbox"
                    checked={rememberToken}
                    onChange={(event) => setRememberToken(event.target.checked)}
                    className="size-3.5 rounded border-[#c9b8a0] text-[#8f6f4f]"
                  />
                  记住我（保存到本地）
                </label>
              </div>

              {error && <p className="text-sm text-[#b24a36]">{error}</p>}
              {uploadMessage && <p className="text-sm text-[#5d7a4b]">{uploadMessage}</p>}
              {success && <p className="text-sm text-[#5d7a4b]">{success}</p>}

              <div className="flex items-center justify-end gap-2">
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  className="rounded-full text-[#7c6852] hover:bg-[#efe5d6] hover:text-[#5e4d3b]"
                >
                  <Link href="/rooftop">取消</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full bg-[#8f6f4f] text-[#fff8ef] hover:bg-[#7e6145]"
                >
                  {submitting ? "发布中..." : "发布分享"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

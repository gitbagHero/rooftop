"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background - 使用渐变色替代外链图片，加载更快 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      {/* 添加纹理效果 */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <p className="text-white/70 tracking-wide">rooftop</p>
            <h1 className="text-4xl sm:text-6xl font-semibold text-white leading-tight">
              Your personal rooftop.
              <br />
              Notes, posts, and projects.
            </h1>
            <p className="text-white/75 max-w-2xl">
              一个简洁的个人主页 + 发帖时间线。先从好看的骨架开始，再逐步加内容。
            </p>
          </div>

          <Card className="bg-white/10 border-white/15 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-white/85">
                <div className="font-medium">接下来我们要做什么？</div>
                <div className="text-sm text-white/65">
                  建立 Posts 路由、发帖表单、列表渲染，再接数据库/部署。
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="secondary">
                  <Link href="http://rooftop.gitbaghero.local:3000">
                    Go Rooftop
                  </Link>
                </Button>
                <Button>Create Post</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

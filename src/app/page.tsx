"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80)",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

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
                <Button variant="secondary">View Posts</Button>
                <Button>Create Post</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
"use client";

import type { CSSProperties, ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Github,
  Home as HomeIcon,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const patternStyles: Record<string, CSSProperties> = {
  default: {
    background:
      "radial-gradient(circle, rgba(159,146,125,0.18) 1.5px, transparent 1.5px) 0 0/28px 28px, radial-gradient(circle, rgba(196,184,158,0.14) 1px, transparent 1px) 7px 7px/14px 14px, rgb(247, 243, 223)",
    borderColor: "#c4b89e",
    color: "#725d42",
  },
  teal: {
    background:
      "radial-gradient(circle, rgba(130,213,187,0.2) 1.5px, transparent 1.5px) 0 0/28px 28px, radial-gradient(circle, rgba(185,235,219,0.16) 1px, transparent 1px) 7px 7px/14px 14px, #e1f6ee",
    borderColor: "#82d5bb",
    color: "#3b725f",
  },
  yellow: {
    background:
      "radial-gradient(circle, rgba(247,205,103,0.24) 1.5px, transparent 1.5px) 0 0/28px 28px, radial-gradient(circle, rgba(255,229,155,0.18) 1px, transparent 1px) 7px 7px/14px 14px, #fff1bf",
    borderColor: "#f7cd67",
    color: "#725d42",
  },
  pink: {
    background:
      "radial-gradient(circle, rgba(248,166,178,0.2) 1.5px, transparent 1.5px) 0 0/28px 28px, radial-gradient(circle, rgba(255,200,210,0.14) 1px, transparent 1px) 7px 7px/14px 14px, #fde4e8",
    borderColor: "#f8a6b2",
    color: "#a85565",
  },
  green: {
    background:
      "radial-gradient(circle, rgba(138,198,138,0.2) 1.5px, transparent 1.5px) 0 0/28px 28px, radial-gradient(circle, rgba(198,230,198,0.16) 1px, transparent 1px) 7px 7px/14px 14px, #e6f4df",
    borderColor: "#8ac68a",
    color: "#4f7744",
  },
};

const featureCards = [
  {
    title: "个人主页",
    body: "这里是 gitbagHero 的主页入口，用来收拢身份介绍、项目展示和公开创作动线。",
    icon: HomeIcon,
    pattern: "teal",
  },
  {
    title: "项目实践",
    body: "关注 AI 工具、知识图谱、健康分析、桌面宠物、VR 课设等可运行的想法。",
    icon: Brain,
    pattern: "yellow",
  },
  {
    title: "博客与笔记",
    body: "博客会作为独立的 SSG 内容区；Rooftop 则保留为更轻量的日常笔记流。",
    icon: BookOpenText,
    pattern: "pink",
  },
];

const routeCards = [
  {
    label: "GitHub 项目",
    href: "https://github.com/gitbagHero",
    description: "查看公开仓库与当前项目方向。",
    icon: Github,
  },
  {
    label: "Rooftop 笔记",
    href: "/rooftop",
    description: "短动态、随手拍和 Markdown 记录。",
    icon: Leaf,
  },
  {
    label: "SSG 博客",
    href: "#blog-plan",
    description: "规划中的长期文章与技术整理区域。",
    icon: BookOpenText,
  },
];

function RibbonTitle({
  children,
  color = "#82d5bb",
  fold = "#5aa88e",
  className,
}: {
  children: React.ReactNode;
  color?: string;
  fold?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[2em] items-center px-[1.6em] text-[18px] font-black leading-none text-white drop-shadow-[0_0.08em_0.12em_rgba(0,0,0,0.05)] sm:text-[22px]",
        className
      )}
      style={
        {
          "--ribbon": color,
          "--ribbon-fold": fold,
        } as CSSProperties
      }
    >
      <span
        className="absolute bottom-[-0.4em] left-[-1.15em] z-0 h-[1.7em] w-[1.7em] bg-[var(--ribbon-fold)]"
        style={{
          clipPath:
            "polygon(100% 0%, 100% 100%, 0% 100%, 30% 50%, 0% 0%)",
        }}
      />
      <span
        className="absolute bottom-[-0.4em] right-[-1.15em] z-0 h-[1.7em] w-[1.7em] bg-[var(--ribbon-fold)]"
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%)",
        }}
      />
      <span className="absolute left-[-0.18em] top-[calc(100%-0.04em)] z-10 h-0 w-0 border-b-[0.45em] border-r-[0.95em] border-b-transparent border-r-[var(--ribbon-fold)]" />
      <span className="absolute right-[-0.18em] top-[calc(100%-0.04em)] z-10 h-0 w-0 border-b-[0.45em] border-l-[0.95em] border-b-transparent border-l-[var(--ribbon-fold)]" />
      <span className="absolute inset-0 z-20 rotate-[3deg] rounded-[0.16em] bg-[var(--ribbon)]" />
      <span className="relative z-30 pt-[0.11em] tracking-[0.04em]">
        {children}
      </span>
    </span>
  );
}

function IslandCard({
  children,
  pattern = "default",
  className,
  id,
}: {
  children: React.ReactNode;
  pattern?: keyof typeof patternStyles;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-[20px] border-[1.5px] p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6",
        className
      )}
      style={patternStyles[pattern]}
    >
      {children}
    </div>
  );
}

function IslandButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "default";
}) {
  return (
    <Button
      asChild
      size="lg"
      variant="default"
      className={cn(
        "h-12 rounded-[24px] border-2 px-7 text-base font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19c8b9]",
        variant === "primary"
          ? "border-[#f8f8f0] bg-[#f8f8f0] text-[#794f27] shadow-[0_5px_0_0_#bdaea0] hover:-translate-y-px hover:bg-[#f8f8f0] hover:shadow-[0_6px_0_0_#bdaea0] active:translate-y-0.5 active:shadow-[0_1px_0_0_#bdaea0]"
          : "border-[#9f927d] bg-[#f8f8f0]/90 text-[#725d42] shadow-[0_2px_4px_0_rgba(61,52,40,0.06)] hover:-translate-y-px hover:border-[#19c8b9] hover:bg-[#f8f8f0] hover:text-[#19c8b9] hover:shadow-[0_3px_10px_0_rgba(61,52,40,0.10)]"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function IconBadge({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-full border-2 border-[#c4b89e] bg-[rgb(247,243,223)] text-[#19a99d]">
      <Icon className="size-5" />
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f8f0] text-[#725d42]">
      <section className="relative min-h-[74svh] overflow-hidden">
        <Image
          src="/images/island-rooftop-hero.png"
          alt="Cozy rooftop writing space on a small island"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,248,240,0.96)_0%,rgba(248,248,240,0.84)_38%,rgba(248,248,240,0.32)_68%,rgba(248,248,240,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(121,79,39,0.08)_1px,transparent_0)] [background-size:28px_28px]" />

        <div className="relative z-10 mx-auto flex min-h-[74svh] w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#c4b89e] bg-[rgb(247,243,223)] px-4 py-2 text-sm font-extrabold text-[#794f27]"
            >
              <Leaf className="size-4 text-[#6fba2c]" />
              gitbagHero
            </Link>
            <nav className="hidden items-center gap-2 sm:flex">
              <Link
                href="https://github.com/gitbagHero"
                className="rounded-full px-4 py-2 text-sm font-bold text-[#725d42] transition-colors hover:bg-[#e6f9f6] hover:text-[#11a89b]"
              >
                Projects
              </Link>
              <Link
                href="/rooftop"
                className="rounded-full px-4 py-2 text-sm font-bold text-[#725d42] transition-colors hover:bg-[#e6f9f6] hover:text-[#11a89b]"
              >
                Notes
              </Link>
            </nav>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-1 items-center py-12 sm:py-16"
          >
            <div className="max-w-2xl">
              <RibbonTitle>Personal Island</RibbonTitle>
              <p className="mt-8 text-sm font-black uppercase tracking-[0.08em] text-[#6fba2c]">
                personal homepage / projects / writing
              </p>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] text-[#794f27] sm:text-6xl lg:text-7xl">
                gitbagHero
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#725d42] sm:text-lg sm:leading-9">
                这里是我的个人主页，用来放置公开项目、阶段性探索和写作入口。
                博客会作为独立的长期文章区，Rooftop 则是更轻量的日常笔记与随手记录。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <IslandButton href="https://github.com/gitbagHero">
                  查看项目
                  <ArrowRight className="size-4" />
                </IslandButton>
                <IslandButton href="/rooftop" variant="default">
                  进入笔记
                  <Leaf className="size-4" />
                </IslandButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-y-2 border-[#d4c9b4] bg-[#e6f9f6]">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle,rgba(25,200,185,0.16)_1.5px,transparent_1.5px)_0_0/28px_28px,radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)_7px_7px/14px_14px]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-5 sm:grid-cols-4 sm:px-8 lg:px-10">
          {[
            ["主页", "个人展示"],
            ["项目", "GitHub 公开仓库"],
            ["博客", "SSG 规划中"],
            ["笔记", "Rooftop 动态流"],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <div className="text-xs font-extrabold uppercase text-[#3b725f]">
                {label}
              </div>
              <div className="mt-1 text-lg font-black text-[#794f27]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="projects"
        className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-10 lg:py-16"
      >
        <div className="space-y-5">
          <RibbonTitle color="#f7cd67" fold="#dba90e" className="text-[16px]">
            About Me
          </RibbonTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map((item) => (
              <IslandCard key={item.title} pattern={item.pattern}>
                <IconBadge icon={item.icon} />
                <h2 className="mt-5 text-xl font-black text-[#794f27]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7">{item.body}</p>
              </IslandCard>
            ))}
          </div>
        </div>

        <IslandCard pattern="green" className="self-start" id="blog-plan">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5a9e1e]">
                site sections
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#794f27]">
                内容分区
              </h2>
            </div>
            <Sparkles className="size-8 text-[#f5c31c]" />
          </div>
          <div className="mt-6 space-y-3">
            {routeCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-[18px] border-2 border-[#c4b89e] bg-[rgb(247,243,223)] p-3 text-[#725d42] transition-all duration-200 hover:-translate-y-px hover:border-[#19c8b9]"
              >
                <IconBadge icon={item.icon} />
                <span className="min-w-0 flex-1">
                  <span className="block font-black text-[#794f27]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[#8a7b66]">
                    {item.description}
                  </span>
                </span>
                <ArrowRight className="size-4 text-[#9f927d] transition-transform group-hover:translate-x-0.5 group-hover:text-[#19c8b9]" />
              </Link>
            ))}
          </div>
        </IslandCard>
      </section>

      <footer className="border-t-2 border-[#d4c9b4] bg-[rgb(247,243,223)] px-5 py-7 text-center text-sm text-[#8a7b66]">
        <span className="font-black text-[#794f27]">gitbagHero</span>
        <span className="mx-2 text-[#c4b89e]">/</span>
        personal homepage, projects, blog, and notes
      </footer>
    </main>
  );
}

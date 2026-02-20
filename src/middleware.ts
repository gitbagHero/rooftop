import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // 支持子域名 rooftop.* 或直接访问 /rooftop 路径
  const isRooftopSubdomain =
    host.startsWith("rooftop.") || 
    host.startsWith("rooftop.localhost") ||
    pathname.startsWith("/rooftop");

  // 跳过 Next.js 内部资源和静态资源
  const isApiRoute = pathname.startsWith("/api");
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$/);

  // API 路由始终走原始路径，避免被子域名前缀重写成 /rooftop/api/*
  if (isApiRoute) return NextResponse.next();

  if (isAsset) return NextResponse.next();

  // 子域名 rooftop.* 访问时，把 /xxx 重写成 /rooftop/xxx
  if (isRooftopSubdomain) {
    // 例如 / -> /rooftop
    if (pathname === "/") {
      url.pathname = "/rooftop";
      return NextResponse.rewrite(url);
    }

    // 已经是 /rooftop/* 时不再重复前缀，避免 /rooftop/rooftop/*
    if (pathname.startsWith("/rooftop")) {
      return NextResponse.next();
    }

    // 例如 /p/123 -> /rooftop/p/123
    url.pathname = `/rooftop${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 主域名正常走原路由
  return NextResponse.next();
}

// 让 middleware 只拦截页面请求（可选，但推荐）
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

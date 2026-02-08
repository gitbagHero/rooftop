import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length).trim();
  return Boolean(process.env.ADMIN_TOKEN) && token === process.env.ADMIN_TOKEN;
}

function normalizeImages(raw: unknown) {
  if (!Array.isArray(raw)) return [] as string[];
  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 9);
}

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const images = normalizeImages(body?.images);

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const created = await prisma.note.create({
      data: {
        content,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes failed:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

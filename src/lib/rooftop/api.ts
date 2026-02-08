import type { CreateNotePayload, Note } from "@/lib/rooftop/types";

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    // no-op
  }
  return `${response.status} ${response.statusText}`.trim();
}

async function ensureOk(response: Response) {
  if (response.ok) return response;
  throw new Error(await parseError(response));
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch("/api/notes", {
    method: "GET",
    cache: "no-store",
  });
  await ensureOk(response);
  return (await response.json()) as Note[];
}

export async function fetchNote(id: string): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  await ensureOk(response);
  return (await response.json()) as Note;
}

export async function createNote(
  payload: CreateNotePayload,
  adminToken: string
): Promise<Note> {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(payload),
  });
  await ensureOk(response);
  return (await response.json()) as Note;
}

export async function deleteNote(id: string, adminToken: string): Promise<void> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  await ensureOk(response);
}

export async function uploadImages(
  files: File[],
  adminToken: string
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    body: formData,
  });

  await ensureOk(response);
  const data = (await response.json()) as { urls?: string[] };
  if (!Array.isArray(data.urls)) {
    throw new Error("上传响应格式错误");
  }
  return data.urls;
}

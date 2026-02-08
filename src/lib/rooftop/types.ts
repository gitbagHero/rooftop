export interface NoteImage {
  id: string;
  url: string;
  order: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  shares: number;
  images: NoteImage[];
}

export interface CreateNotePayload {
  content: string;
  images: string[];
}

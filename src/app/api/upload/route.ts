import { NextResponse } from 'next/server';
import { saveUpload } from '@/lib/storage';

export const runtime = 'nodejs';

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

/**
 * POST /api/upload
 * multipart/form-data: { file: File, folder?: "clothing" | "model" }
 * → { url: string }
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const folder = (form.get('folder') as string) || 'clothing';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 15MB).' }, { status: 413 });
    }
    if (file.type && !ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported type: ${file.type}` },
        { status: 415 }
      );
    }

    const url = await saveUpload(file, folder === 'model' ? 'model' : 'clothing');
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { supabaseBucket, isSupabaseServerConfigured } from '@/lib/config';

const LOCAL_DIR = path.join(process.cwd(), 'public', 'uploads');

function extFromType(type: string): string {
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  return 'bin';
}

/**
 * Persist an uploaded file and return a public URL.
 *
 * - Supabase configured → uploads to a storage bucket, returns its public URL.
 * - Otherwise            → writes to /public/uploads and returns a local path.
 */
export async function saveUpload(
  file: File,
  folder = 'clothing'
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromType(file.type || '');
  const key = `${folder}/${randomUUID()}.${ext}`;

  if (isSupabaseServerConfigured) {
    const supabase = getSupabaseAdmin()!;
    const { error } = await supabase.storage
      .from(supabaseBucket)
      .upload(key, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(key);
    return data.publicUrl;
  }

  // Local fallback.
  const dest = path.join(LOCAL_DIR, folder);
  await fs.mkdir(dest, { recursive: true });
  const filename = path.basename(key);
  await fs.writeFile(path.join(dest, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}

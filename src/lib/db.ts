import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseServerConfigured } from '@/lib/config';
import type { Generation } from '@/lib/types';

const LOCAL_FILE = path.join(process.cwd(), '.data', 'gallery.json');

/* ─────────────────────────── Local JSON store ─────────────────────────── */

async function readLocal(): Promise<Generation[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, 'utf8');
    return JSON.parse(raw) as Generation[];
  } catch {
    return [];
  }
}

async function writeLocal(rows: Generation[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2), 'utf8');
}

/* ──────────────────────── Supabase row mapping ─────────────────────────── */

interface Row {
  id: string;
  created_at: string;
  user_id: string | null;
  style: Generation['style'];
  category: Generation['category'];
  clothing_url: string;
  model_url: string | null;
  result_url: string;
  prompt: string | null;
  provider: string;
  status: Generation['status'] | null;
}

function fromRow(r: Row): Generation {
  return {
    id: r.id,
    createdAt: r.created_at,
    userId: r.user_id ?? null,
    style: r.style,
    category: r.category ?? null,
    clothingUrl: r.clothing_url,
    modelUrl: r.model_url ?? null,
    resultUrl: r.result_url,
    prompt: r.prompt ?? null,
    provider: r.provider,
    status: r.status ?? 'complete',
  };
}

function toRow(g: Generation): Row {
  return {
    id: g.id,
    created_at: g.createdAt,
    user_id: g.userId,
    style: g.style,
    category: g.category,
    clothing_url: g.clothingUrl,
    model_url: g.modelUrl,
    result_url: g.resultUrl,
    prompt: g.prompt,
    provider: g.provider,
    status: g.status,
  };
}

/* ────────────────────────────── Public API ────────────────────────────── */

export async function createGeneration(
  data: Omit<Generation, 'id' | 'createdAt'>
): Promise<Generation> {
  const record: Generation = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseServerConfigured) {
    const supabase = getSupabaseAdmin()!;
    const { data: inserted, error } = await supabase
      .from('generations')
      .insert(toRow(record))
      .select()
      .single();
    if (error) throw new Error(`DB insert failed: ${error.message}`);
    return fromRow(inserted);
  }

  const rows = await readLocal();
  rows.unshift(record);
  await writeLocal(rows);
  return record;
}

export async function listGenerations(
  userId?: string | null
): Promise<Generation[]> {
  if (isSupabaseServerConfigured) {
    const supabase = getSupabaseAdmin()!;
    let query = supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw new Error(`DB query failed: ${error.message}`);
    return (data ?? []).map(fromRow);
  }

  const rows = await readLocal();
  return userId ? rows.filter((r) => r.userId === userId) : rows;
}

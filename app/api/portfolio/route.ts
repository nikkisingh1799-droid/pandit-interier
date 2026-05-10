import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SESSION_COOKIE, SESSION_SECRET } from '@/lib/auth';

function isAdmin(req: NextRequest) {
  return req.cookies.get(SESSION_COOKIE)?.value === SESSION_SECRET;
}

// GET — public
export async function GET() {
  const { data, error } = await supabase.from('portfolio').select('*').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — admin only
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const newItem = { ...body, id: Date.now().toString() };
  const { data, error } = await supabase.from('portfolio').insert(newItem).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

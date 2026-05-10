import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_SECRET } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (session === SESSION_SECRET) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false }, { status: 401 });
}

import { NextRequest, NextResponse } from 'next/server';
import { listAuditLogs } from '@/lib/audit';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get('abdou_admin_token')?.value;
  if (!token) {
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
  return verifyToken(token) !== null;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const logs = await listAuditLogs(150);
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

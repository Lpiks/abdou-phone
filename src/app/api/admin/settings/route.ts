import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Setting from '@/models/Setting';
import { verifyToken } from '@/lib/auth';
import { recordAuditLog, maskIp } from '@/lib/audit';

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get('abdou_admin_token')?.value;
  if (!token) {
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
  return verifyToken(token) !== null;
}

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.findOne().lean();
    if (!settings) {
      const created = await Setting.create({});
      return NextResponse.json({ success: true, settings: created.toObject() });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const updated = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    ).lean();

    const token = req.cookies.get('abdou_admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const clientIp = maskIp(req.headers.get('x-forwarded-for') || '127.0.0.1');

    await recordAuditLog({
      action: 'settings_update',
      adminEmail: admin?.email || 'admin@abdouphone.dz',
      targetType: 'settings',
      details: 'Mise à jour des coordonnées et identifiants légaux du magasin.',
      ipMasked: clientIp,
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

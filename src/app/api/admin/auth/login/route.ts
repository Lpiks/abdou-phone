import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { recordAuditLog, maskIp } from '@/lib/audit';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@abdouphone.dz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminabdou2026';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = maskIp(forwarded || '127.0.0.1');

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Identifiants requis.' },
        { status: 400 }
      );
    }

    if (
      email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() &&
      password === ADMIN_PASSWORD
    ) {
      // Record immutable audit entry
      await recordAuditLog({
        action: 'admin_login_success',
        adminEmail: ADMIN_EMAIL,
        targetType: 'auth',
        details: 'Connexion réussie au tableau de bord administrateur.',
        ipMasked: clientIp,
      });

      const token = generateToken({
        userId: 'admin_master_1',
        email: ADMIN_EMAIL,
        role: 'superadmin',
      });

      const response = NextResponse.json({
        success: true,
        message: 'Connexion réussie',
        user: { email: ADMIN_EMAIL, name: 'Abdou Phone Superadmin' },
      });

      response.cookies.set('abdou_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Email ou mot de passe incorrect.' },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

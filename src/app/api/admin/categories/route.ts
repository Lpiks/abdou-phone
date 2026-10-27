import { NextRequest, NextResponse } from 'next/server';
import { listAllCategories, createCategory, updateCategory, deleteCategory } from '@/lib/orders-store';
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
    const categories = await listAllCategories();
    return NextResponse.json({ success: true, count: categories.length, categories });
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
    const { name, arabicName, description, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Le nom de la catégorie est obligatoire.' }, { status: 400 });
    }

    const created = await createCategory({
      id: '',
      name: name.trim(),
      arabicName: arabicName?.trim() || undefined,
      description: description?.trim() || undefined,
      icon: icon?.trim() || 'Package',
    });

    const token = req.cookies.get('abdou_admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const clientIp = maskIp(req.headers.get('x-forwarded-for') || '127.0.0.1');

    await recordAuditLog({
      action: 'category_create',
      adminEmail: admin?.email || 'admin@abdouphone.dz',
      targetType: 'settings',
      targetId: created.id,
      details: `Création de la catégorie "${created.name}" (${created.id}).`,
      ipMasked: clientIp,
    });

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Identifiant catégorie manquant.' }, { status: 400 });
    }

    const updated = await updateCategory(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Catégorie introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Identifiant catégorie manquant.' }, { status: 400 });
    }

    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Catégorie introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Catégorie supprimée avec succès.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

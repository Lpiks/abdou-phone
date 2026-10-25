import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, isCloudinaryConfigured } from '@/lib/cloudinary';

export const runtime = 'nodejs';

// 10MB maximum file size
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier image reçu.' },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Format d'image non supporté (${file.type}). Utilisez JPG, PNG, WEBP ou AVIF.`,
        },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Taille du fichier trop volumineuse (${(file.size / (1024 * 1024)).toFixed(1)} Mo). Limite : 10 Mo.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImage(buffer, file.name);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      provider: result.provider,
      cloudinaryActive: isCloudinaryConfigured(),
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('[API Upload Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Échec du téléversement de l’image.',
      },
      { status: 500 }
    );
  }
}

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Check if Cloudinary credentials are valid and provided
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  // Check against common placeholders
  if (
    cloudName.includes('your_') ||
    apiKey.includes('your_') ||
    apiSecret.includes('your_') ||
    cloudName === 'cloud_name'
  ) {
    return false;
  }

  return true;
}

// Lazy configure Cloudinary
export function getCloudinary() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
      api_key: process.env.CLOUDINARY_API_KEY?.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
      secure: true,
    });
  }
  return cloudinary;
}

export interface UploadResult {
  url: string;
  publicId: string;
  provider: 'cloudinary' | 'local';
  format?: string;
  bytes?: number;
}

/**
 * Upload an image buffer either to Cloudinary (if configured)
 * or to local filesystem (public/uploads/products) as a resilient fallback.
 */
export async function uploadImage(
  buffer: Buffer,
  originalFilename: string = 'product.jpg',
  folder: string = 'abdou-phone/products'
): Promise<UploadResult> {
  const hasCloudinary = isCloudinaryConfigured();

  if (hasCloudinary) {
    const cld = getCloudinary();

    return new Promise((resolve, reject) => {
      const uploadStream = cld.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error('[Cloudinary Upload Error]', error);
            // Fall back to local file storage on upload error
            saveLocally(buffer, originalFilename)
              .then(resolve)
              .catch(reject);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              provider: 'cloudinary',
              format: result.format,
              bytes: result.bytes,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Cloudinary credentials not configured yet: persist to public/uploads
  return saveLocally(buffer, originalFilename);
}

/**
 * Local file fallback saving in public/uploads/products
 */
async function saveLocally(buffer: Buffer, originalFilename: string): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(originalFilename) || '.jpg';
  const cleanBase = path
    .basename(originalFilename, ext)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const uniqueName = `${Date.now()}_${cleanBase}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.promises.writeFile(filePath, buffer);

  return {
    url: `/uploads/products/${uniqueName}`,
    publicId: uniqueName,
    provider: 'local',
    bytes: buffer.length,
  };
}

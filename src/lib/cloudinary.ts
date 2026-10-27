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

/**
 * Extract public_id from Cloudinary URL or return the public_id as is.
 * e.g. "https://res.cloudinary.com/rvoexlnt/image/upload/v1793072106/abdou-phone/products/ldydyuqr76fg5fsltxqm.jpg"
 *  -> "abdou-phone/products/ldydyuqr76fg5fsltxqm"
 */
export function extractPublicId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('cloudinary.com')) {
    return urlOrId.startsWith('/') ? null : urlOrId;
  }
  try {
    const parts = urlOrId.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    // Remove version prefix if present: v1234567890/
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Remove file extension
    const withoutExt = withoutVersion.replace(/\.[^/.]+$/, '');
    return withoutExt;
  } catch {
    return null;
  }
}

/**
 * Delete an image asset from Cloudinary or local uploads directory.
 */
export async function deleteImage(urlOrPublicId: string): Promise<boolean> {
  if (!urlOrPublicId) return false;

  // 1. If it's a local file upload (/uploads/products/...)
  if (urlOrPublicId.startsWith('/uploads/products/')) {
    try {
      const fileName = path.basename(urlOrPublicId);
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'products', fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    } catch (e) {
      console.warn('[Storage] Failed to delete local image file:', e);
    }
    return false;
  }

  // 2. If it's on Cloudinary
  if (isCloudinaryConfigured()) {
    const publicId = extractPublicId(urlOrPublicId);
    if (!publicId) return false;
    try {
      const cld = getCloudinary();
      const res = await cld.uploader.destroy(publicId, { resource_type: 'image' });
      return res.result === 'ok';
    } catch (err) {
      console.warn('[Cloudinary] Failed to delete image asset:', publicId, err);
      return false;
    }
  }

  return false;
}

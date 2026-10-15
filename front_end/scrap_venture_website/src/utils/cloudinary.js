/**
 * Direct Frontend Cloudinary Image Upload
 * Uses exact credentials defined in .env:
 * CLOUD_NAME = wetcykej
 * CLOUD_API_KEY = 617482674228793
 * CLOUD_API_SECRET = Up3K3gELLLa83_0LMKBr-TK35OE
 *
 * Uploads directly from the browser to Cloudinary and returns the secure URL.
 */

const CLOUD_NAME = import.meta.env?.VITE_CLOUD_NAME || 'wetcykej';
const CLOUD_API_KEY = import.meta.env?.VITE_CLOUD_API_KEY || '617482674228793';
const CLOUD_API_SECRET = import.meta.env?.VITE_CLOUD_API_SECRET || 'Up3K3gELLLa83_0LMKBr-TK35OE';

export async function uploadToCloudinary(file) {
  if (!file) throw new Error('No file selected for upload');

  const timestamp = Math.floor(Date.now() / 1000);
  const strToSign = `timestamp=${timestamp}${CLOUD_API_SECRET}`;

  // Generate SHA-1 hash signature using browser's native Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(strToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUD_API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Cloudinary upload failed with status ${res.status}`);
  }

  const result = await res.json();
  return result.secure_url || result.url;
}

import "server-only";

import { UTApi } from "uploadthing/server";

import { ApiError } from "@/server/api";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const AVATAR_TYPES = new Set([...IMAGE_TYPES, "image/gif"]);

function client() {
  const token = process.env.UPLOADTHING_TOKEN;
  if (!token) throw new Error("UPLOADTHING_TOKEN is not configured");
  return new UTApi({ token });
}

export function optionalFile(formData: FormData | undefined, field: string) {
  const value = formData?.get(field);
  return value instanceof File && value.size > 0 ? value : undefined;
}

export async function uploadImage(file: File, allowGif = false) {
  if (file.size > MAX_IMAGE_BYTES) throw new ApiError(400, "Image must be 10 MB or smaller", "INVALID_FILE");
  const allowed = allowGif ? AVATAR_TYPES : IMAGE_TYPES;
  if (!allowed.has(file.type)) throw new ApiError(400, "Only JPEG, PNG, and WebP images are allowed", "INVALID_FILE");
  const result = await client().uploadFiles(file);
  if (!result.data) throw new ApiError(502, result.error?.message ?? "Image upload failed", "UPLOAD_FAILED");
  return { url: result.data.url, key: result.data.key };
}

export async function deleteUpload(key: string | null | undefined) {
  if (!key) return;
  try {
    await client().deleteFiles(key);
  } catch (error) {
    console.error("Failed to delete UploadThing object", { key, error });
  }
}

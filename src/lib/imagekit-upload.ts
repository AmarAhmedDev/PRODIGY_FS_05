import { getImageKitAuth } from "@/server/imagekit.functions";

export interface UploadResult {
  url: string;
  fileId: string;
  thumbnailUrl?: string;
  fileType: string;
  height?: number;
  width?: number;
}

export async function uploadToImageKit(file: File): Promise<UploadResult> {
  const { token, expire, signature, publicKey } = await getImageKitAuth();

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", file.name);
  form.append("publicKey", publicKey);
  form.append("token", token);
  form.append("expire", String(expire));
  form.append("signature", signature);
  form.append("useUniqueFileName", "true");
  form.append("folder", "/social");

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ImageKit upload failed: ${text}`);
  }

  const data = await res.json();
  return {
    url: data.url,
    fileId: data.fileId,
    thumbnailUrl: data.thumbnailUrl,
    fileType: data.fileType,
    height: data.height,
    width: data.width,
  };
}
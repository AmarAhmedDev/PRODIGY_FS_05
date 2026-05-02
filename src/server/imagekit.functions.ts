import { createServerFn } from "@tanstack/react-start";
import { createHmac, randomBytes } from "crypto";

/**
 * Returns ImageKit upload auth params (token, expire, signature).
 * Frontend uses these with the public key to upload directly to ImageKit.
 * The private key NEVER leaves the server.
 */
export const getImageKitAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
      throw new Error("ImageKit env vars are not configured");
    }

    const token = randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 min
    const signature = createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return { token, expire, signature, publicKey, urlEndpoint };
  },
);
import ImageKit from "imagekit";

let imagekitInstance: any | null = null;

function getImageKitInstance() {
  if (imagekitInstance) return imagekitInstance;

  const publicKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY || "";
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT || "";

  if (!publicKey) {
    // Avoid throwing during module evaluation/build. Log and return null so callers
    // can handle missing configuration gracefully at runtime.
    console.warn("ImageKit not configured: missing publicKey");
    return null;
  }

  try {
    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
    return imagekitInstance;
  } catch (err) {
    console.error("Failed to initialize ImageKit:", err);
    return null;
  }
}

export const uploadImage = async (
  file: File,
  fileName: string,
  folder?: string,
): Promise<string> => {
  const ik = getImageKitInstance();
  if (!ik) {
    const msg = "ImageKit is not configured in this environment";
    console.error(msg);
    throw new Error(msg);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await ik.upload({
      file: buffer,
      fileName: fileName,
      folder: folder || process.env.IMAGEKIT_FOLDER || "products",
      useUniqueFileName: true,
    });

    return response.url;
  } catch (err: any) {
    console.error("ImageKit upload error:", {
      name: err?.name,
      message: err?.message,
      status: err?.response?.status,
      body: err?.response?.data ? "[response data]" : undefined,
    });
    throw err;
  }
};

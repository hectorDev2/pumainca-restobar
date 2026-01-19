import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export const uploadImage = async (
  file: File,
  fileName: string,
  folder?: string,
): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await imagekit.upload({
      file: buffer, // required
      fileName: fileName, // required
      folder: folder || process.env.IMAGEKIT_FOLDER || "products",
      useUniqueFileName: true,
    });

    return response.url;
  } catch (err: any) {
    console.error("ImageKit upload error:", {
      name: err?.name,
      message: err?.message,
      status: err?.response?.status,
      // avoid printing sensitive response bodies directly
      body: err?.response?.data ? "[response data]" : undefined,
    });
    throw err;
  }
};

export default imagekit;

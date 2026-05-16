import { InputFile, ID } from "node-appwrite";

import { storage, BUCKET_ID_IMAGE } from "@/lib/appwrite.config";

export const createImageProfile = async (
  imageFile: FormData,
  existingFileId?: string
) => {
  try {
    if (imageFile) {
      const inputFile = await InputFile.fromBlob(
        imageFile.get("blobFile") as Blob,
        imageFile.get("fileName") as string
      );

      if (existingFileId && inputFile) {
        await storage.deleteFile(BUCKET_ID_IMAGE!, existingFileId);
      }
      return await storage.createFile(BUCKET_ID_IMAGE!, ID.unique(), inputFile);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

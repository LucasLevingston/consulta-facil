import { InputFile, ID } from "node-appwrite";

import { storage, BUCKET_ID_DOCUMENT } from "@/lib/appwrite.config";

export const createDocument = async (
  identificationDocument: FormData,
  existingFileId?: string
) => {
  try {
    if (identificationDocument) {
      const inputFile = InputFile.fromBlob(
        identificationDocument.get("blobFile") as Blob,
        identificationDocument.get("fileName") as string
      );
      if (existingFileId) {
        const newFile = await storage.createFile(
          BUCKET_ID_DOCUMENT!,
          ID.unique(),
          inputFile
        );
        return await storage.updateFile(
          BUCKET_ID_DOCUMENT!,
          existingFileId,
          newFile.name
        );
      }

      return await storage.createFile(BUCKET_ID_DOCUMENT!, ID.unique(), inputFile);
    }
  } catch (error) {
    return null;
  }
};

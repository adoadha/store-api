import { deletePicture, uploadPicture } from "@/lib/cloudinary";

export default class CommondService {
  async uploadImage(File: Buffer) {
    try {
      const res = await uploadPicture(File);

      return res;
    } catch (error) {
      console.log(error, "INI ERROR UPLOAD GUSTI");
    }
  }

  async deleteImageCloudinary(public_id: string) {
    try {
      const res = await deletePicture(public_id);

      return res;
    } catch (error) {
      console.log(error, "Error Upload");
      throw error;
    }
  }

  extractUrl(url: string) {
    const lastIndex = url.lastIndexOf("/");
    const fileNameWithExtension = url.substring(lastIndex + 1);
    const dotIndex = fileNameWithExtension.lastIndexOf(".");
    const fileNameWithoutExtension = fileNameWithExtension.substring(
      0,
      dotIndex
    );
    return fileNameWithoutExtension;
  }
}

import { uploadPicture } from "@/lib/cloudinary";

export default class CommondService {
  async uploadImage(File: Buffer) {
    try {
      const res = await uploadPicture(File);

      return res;
    } catch (error) {
      console.log(error, "INI ERROR UPLOAD GUSTI");
    }
  }
}

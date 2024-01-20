import config from "@/config";
import cloudinary, { UploadApiResponse } from "cloudinary";

cloudinary.v2.config({
  cloudName: config.CLOUD_NAME,
  apiKey: config.CLOUD_API_KEY,
  apiSecret: config.CLOUD_API_SECRET,
});

export function uploadPicture(content: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          folder: "clean-fastify",
          // eager : [{ width : 400, height : 400, crop : 'crop', gravity : 'face'}]
        },
        (error, result) => {
          if (error) {
            reject("Upload failed");
          } else if (result) {
            resolve(result);
          } else {
            reject("Internal server error");
          }
        }
      )
      .end(content);
  });
}

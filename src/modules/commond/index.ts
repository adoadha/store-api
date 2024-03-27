import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import * as handler from "./handler";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/test",
    method: "POST",
    handler: handler.handleUploadImage,
  });
  fastify.route({
    url: "/cloudinary/delete/:public_id",
    method: "POST",
    handler: handler.handleDeleteImage, // Menggunakan handleDeleteImage
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "commond-module",
});

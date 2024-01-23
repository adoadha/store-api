import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import * as handler from "./handler";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/test",
    method: "POST",
    handler: handler.handleUploadImage,
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "commond-module",
});

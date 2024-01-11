import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import * as handler from "./handler";
import authlogin from "./auth-login.json";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/auth/login",
    method: "POST",
    handler: handler.authLogin,
    schema: {
      body: authlogin,
    },
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "auth-module",
});

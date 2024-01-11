import autoLoad from "@fastify/autoload";
import Ajv from "ajv";
import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import { join } from "path";
import config from "./constant/config";

const server = fastify({
  ajv: { customOptions: { coerceTypes: "array" } },
});

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  strict: false,
  allErrors: true,
});

server.get("/health", async (request, reply) => {
  reply.send({ healthcheck: "server is alive" });
});

server.register(require("@fastify/jwt"), { secret: config.SECRET_KEY });

declare module "fastify" {
  interface FastifyInstance {
    jwt: any;
  }
}

server.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

server.register(autoLoad, {
  dir: join(__dirname, "modules"),
  maxDepth: 2,
});

server.ready((err) => {
  if (err) throw err;

  console.log(server.printRoutes());
});

server.addHook("onResponse", (request, _reply, done) => {
  done();
});

server.setErrorHandler(function (error, request, reply) {
  reply.code(error.statusCode ?? 0).send({ ...error });
});

export const app: FastifyInstance = server;

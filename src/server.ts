import autoLoad from "@fastify/autoload";
import Ajv from "ajv";
import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import { join } from "path";
import config from "./constant/config";
import fastifyCors from "@fastify/cors";

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

server.register(fastifyCors, () => {
  return (req: any, callback: any) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: config.ORIGIN,
      allowedHeaders: [
        "Accept",
        "Authorization",
        "Content-Type",
        "If-None-Match",
        "Accept-language",
        "cache-control",
        "x-requested-with",
      ],
    };

    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = "*";
    }

    callback(null, corsOptions);
  };
});

export const app: FastifyInstance = server;

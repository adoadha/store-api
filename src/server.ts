import autoLoad from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import Ajv from "ajv";
import "dotenv/config";
import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import path, { join } from "path";
import config from "./constant/config";
import fastifyCloudinary from "fastify-cloudinary";
import fastifyMultipart from "@fastify/multipart";
import cloudinary from "cloudinary";
import stream from "stream";
import fs from "fs";
import util from "util";

const pipeline = util.promisify(stream.pipeline);

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

server.register(fastifyMultipart);
server.register(fastifyCloudinary, {
  url: `cloudinary://${config.CLOUD_API_KEY}:${config.CLOUD_API_SECRET}@${config.CLOUD_NAME}`,
});

cloudinary.v2.config({
  cloudName: config.CLOUD_NAME,
  apiKey: config.CLOUD_API_KEY,
  apiSecret: config.CLOUD_API_SECRET,
});

server.post("/upload", async (request: FastifyRequest, reply) => {
  try {
    const data = await request.file();

    if (data) {
      await pipeline(
        data.file,
        server.cloudinary.uploader.upload_stream({ public_id: data.fieldname })
      );

      return reply.send({ url: server.cloudinary.url(data.fieldname) });
    }
  } catch (err) {
    reply.code(500).send(err);
  }
});

export const app: FastifyInstance = server;

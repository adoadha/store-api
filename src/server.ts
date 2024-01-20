import autoLoad from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import Ajv from "ajv";
import "dotenv/config";
import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { join } from "path";
import config from "./constant/config";
import fastifyCloudinary from "fastify-cloudinary";
import fastifyMultipart from "@fastify/multipart";
import { v2 as cloudinary } from "cloudinary";

interface FileData {
  file: {
    fieldname: string;
    filename: string;
    encoding: string;
    mimetype: string;
    tempFilePath: string;
    size: number;
  };
}

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

server.register(fastifyMultipart, { attachFieldsToBody: true });

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

server.register(fastifyCloudinary, {
  // cloudinary: {
  //   cloudName: config.CLOUD_NAME,
  //   apiKey: config.CLOUD_API_KEY,
  //   apiSecret: config.CLOUD_API_SECRET,
  // },
  url: `cloudinary://${config.CLOUD_API_KEY}:${config.CLOUD_API_SECRET}@${config.CLOUD_NAME}`,
});

// server.post("/upload", async (request, reply) => {
//   try {
//     const data: any = request.file;

//     if (!data) {
//       console.log(request.file, "data");
//     }

//     const result = await cloudinary.uploader.upload(data.file, {
//       folder: "folder_upload_anda", // Tentukan folder di Cloudinary
//     });

//     const imageUrl = result.secure_url;

//     return { imageUrl };
//   } catch (err) {
//     reply.code(500).send(err);
//   }
// });

server.route({
  url: "/upload",
  method: "POST",
  handler: async (request: FastifyRequest, reply) => {
    try {
      const data: any = await request.file();

      // console.log(JSON.stringify(data));

      if (!data || !data.file) {
        reply.code(400).send({ error: "No file uploaded" });
        return;
      }

      // @ts-nocheck
      const result = await server.cloudinary.uploader.upload(
        data.file.tempFilePath,
        {
          public_id: `${Date.now()}`,
          resource_type: "auto",
        }
      );
      console.log("DISINI");

      const imageUrl = result.secure_url;

      // return { imageUrl };
    } catch (err) {
      reply.code(500).send(err);
    }
  },
});

export const app: FastifyInstance = server;

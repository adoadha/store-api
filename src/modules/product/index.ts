import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import * as handler from "./handler";
import categorySchema from "./category-schema.json";
import productSchema from "./product-schema.json";
import auth from "@/middlewares/auth";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/product/category",
    method: "POST",
    handler: handler.createNewCategory,
    schema: {
      body: categorySchema,
    },
    preHandler: [auth],
  });
  fastify.route({
    url: "/product/category",
    method: "DELETE",
    handler: handler.dropCategory,
    preHandler: [auth],
  });
  fastify.route({
    url: "/product/category",
    method: "GET",
    handler: handler.getCategoryProduct,
    preHandler: [auth],
  });
  fastify.route({
    url: "/product/create",
    method: "POST",
    handler: handler.createNewProduct,
    schema: {
      body: productSchema,
    },
  });
  fastify.route({
    url: "/product/delete",
    method: "DELETE",
    handler: handler.deleteProduct,
    preHandler: [auth],
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "product-module",
});

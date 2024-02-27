import auth from "@/middlewares/auth";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import categorySchema from "./category-schema.json";
import testingSchema from "./testing-schema.json";
import * as handler from "./handler";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/product/category",
    method: "POST",
    handler: handler.createNewCategory,
    schema: {
      // @ts-ignore
      consumes: "multipart/form-data",
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
    // schema: {
    //   body: productSchema,
    // },
    // preHandler: [auth],
  });
  fastify.route({
    url: "/product/delete",
    method: "DELETE",
    handler: handler.deleteProduct,
    preHandler: [auth],
  });
  fastify.route({
    url: "/product",
    method: "GET",
    handler: handler.GetAllProduct,
    preHandler: [auth],
  });
  fastify.route({
    url: "/product/:ProductId",
    method: "GET",
    handler: handler.GetProductById,
    preHandler: [auth],
  });

  fastify.route({
    url: "/product/create/testing",
    method: "POST",
    handler: handler.createOldProduct,
    // schema: {
    //   body: testingSchema,
    // },
  });

  fastify.route({
    url: "/product/stocks",
    method: "GET",
    handler: handler.GetAllStocks,
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "product-module",
});

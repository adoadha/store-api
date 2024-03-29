import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import * as handler from "./handler";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/inventory/stocks",
    method: "GET",
    handler: handler.GetAllStocks,
  });
  fastify.route({
    url: "/inventory/suplier",
    method: "GET",
    handler: handler.GetAllStocks,
  });
  fastify.route({
    url: "/inventory/inbound",
    method: "POST",
    handler: handler.CreatePurchaseInbound,
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "inventory-module",
});

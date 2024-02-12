import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import customerSchema from "./customer-schema.json";
import * as handler from "./handler";
import auth from "@/middlewares/auth";

const pluginAsync: FastifyPluginAsync = async (fastify, _option) => {
  fastify.route({
    url: "/customer/create",
    method: "POST",
    handler: handler.createNewCustomer,
    schema: {
      body: customerSchema,
    },
    preHandler: [auth],
  });
  fastify.route({
    url: "/customer",
    method: "GET",
    handler: handler.GetAllCustomers,
    preHandler: [auth],
  });
};

export default fp(pluginAsync, {
  fastify: "4.x",
  name: "customer-module",
});

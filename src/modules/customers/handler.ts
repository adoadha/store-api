import { ICreateCustomers, ICustomers } from "@/interfaces/customers";
import CustomerRepository from "@/repository/customer.repository";
import CustomerService from "@/service/customers/customers.service";
import { ErrorHandle } from "@/utils/error-helpers";
import { ResponseSuccess } from "@/utils/response";
import { FastifyReply, FastifyRequest } from "fastify";

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);

export const createNewCustomer = async (
  request: FastifyRequest<{ Body: ICreateCustomers }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (request.validationError) {
      return ErrorHandle(request, reply, request.validationError);
    }

    const response = await customerService.createUserCustomers(request.body);

    return ResponseSuccess(reply, {
      data: response,
      message: "Create Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const GetAllCustomers = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<ICustomers[]> => {
  try {
    const response = await customerService.getCustomers();

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

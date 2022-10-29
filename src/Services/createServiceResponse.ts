import type ServiceResponse from "src/ts/types/ServiceResponse";

const createServiceResponse = (
  success: boolean,
  status = 500,
  errorMessage = "No error desription",
  payload?: object,
): ServiceResponse => ({
  success,
  status,
  errorMessage,
  payload,
});

export default createServiceResponse;

import type ServiceResponse from "src/ts/types/ServiceResponse";

const createServiceResponse = (
  success: boolean,
  status: number,
  message = "",
): ServiceResponse => ({
  success,
  status,
  message,
});

export default createServiceResponse;

import type ServiceResponse from "src/ts/types/ServiceResponse";

const createServiceResponse = (
  success: boolean,
  status: number,
  errorMessage = "",
): ServiceResponse => ({
  success,
  status,
  errorMessage,
});

export default createServiceResponse;

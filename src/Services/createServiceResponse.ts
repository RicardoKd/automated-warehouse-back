import type IServiceResponse from "src/Types/IServiceResponse";

const createServiceResponse = (
  success: boolean,
  status: number,
  errorMessage = "",
): IServiceResponse => ({
  success,
  status,
  errorMessage,
});

export default createServiceResponse;

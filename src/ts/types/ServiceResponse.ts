type ServiceResponse = {
  success: boolean;
  status: number;
  errorMessage?: string;
  payload?: object | undefined;
};

export default ServiceResponse;

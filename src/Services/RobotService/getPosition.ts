import type IRobot from "src/ts/Interfaces/IRobot.js";
import type ServiceResponse from "src/ts/types/ServiceResponse.js";
import createServiceResponse from "../createServiceResponse.js";

const getPosition = (robot: IRobot): ServiceResponse => {
  let robotPosition;

  try {
    robotPosition = robot.getCurrentPosition();

    if (!robotPosition) {
      return createServiceResponse(false, 503, "Robot position lost");
    }
  } catch (error) {
    return createServiceResponse(false, 503, String(error));
  }

  return createServiceResponse(true, 200, "", { robotPosition });
};

export default getPosition;

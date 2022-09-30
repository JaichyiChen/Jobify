import { UnauthenticatedError } from "../errors/index.js";

const checkPermission = (requestUser, resourceUser) => {
  if (requestUser.userId === resourceUser.toString()) return;
  throw new UnauthenticatedError("Not authorized to access this route");
};

export default checkPermission;

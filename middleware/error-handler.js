import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  //two objects, the out error object, and inner errors object will be returned
  const defaultError = {
    //err.statusCodes passed from controllers
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    //err.message is going to be passed down from the controller
    msg: err.message || "Something went wrong, please try again later",
  };
  //name is located in the err object returned
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // defaultError.msg = err.message;
    //convert the err.errors object into an array, iterate through it to retrieve the specific error message.
    //and then returning it to shorten the error message
    defaultError.msg = Object.values(err.errors)
      .map((items) => {
        return items.message;
      })
      .join(",");
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_GATEWAY;
    //email: 123@email.com, object key will return the key
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;

const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  
  console.log(`<ErrorHandler>: `, error);

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map( value => value.message )
      .join(",");
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = "Duplicated field value entered";
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;

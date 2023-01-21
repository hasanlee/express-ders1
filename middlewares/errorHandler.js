const Exception = require("../utils/Exception");

const errorHandler = (err, req, res, next) => {
  if (err instanceof Exception) {
    res.status(err.statusCode).json({ error: true, message: err.message });
  }

  res
    .status(err.status || 500)
    .json({ error: true, message: err.message, stack: err.stack });
};

module.exports = { errorHandler };

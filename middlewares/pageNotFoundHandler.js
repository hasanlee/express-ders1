const Exception = require("../utils/Exception");

const pageNotFoundHandler = (req, res, next) => {
  const err = new Error("Page Not found");
  err.status = 404;
  next(err);
};
module.exports = { pageNotFoundHandler };

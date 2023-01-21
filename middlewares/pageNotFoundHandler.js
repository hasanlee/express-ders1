const Exception = require("../utils/Exception");

const pageNotFoundHandler = (req, res, next) => {
  const err = new Exception(404, "Page Not found", "0404");
  next(err);
};
module.exports = { pageNotFoundHandler };

const { NotFoundError } = require("../utils/errors");

const routeMiddleware = (req, res, next) => {
  throw NotFoundError("Route not found");
};

module.exports = routeMiddleware;

const express = require("express");
const route = require("../routes/routes");
const routeMiddleware = require("../middlewares/invalid-route");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api", route);
  app.use(routeMiddleware);
};

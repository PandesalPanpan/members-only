const { Router } = require("express");
const controller = require("../controllers/controller");

const indexRouter = new Router();

indexRouter.get('/sign-up', controller.createUserGet);
indexRouter.post("/sign-up", controller.createUserPost);
indexRouter.get("/login", controller.loginGet);
indexRouter.post("/login", controller.loginPost);
indexRouter.get('/', controller.indexPageGet);


module.exports = indexRouter;
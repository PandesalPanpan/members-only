const { Router } = require("express");
const controller = require("../controllers/controller");

const indexRouter = new Router();

indexRouter.get('/sign-up', controller.createUserGet);
indexRouter.post("/sign-up", controller.createUserPost);
indexRouter.get("/login", controller.loginGet);
indexRouter.post("/login", controller.loginPost);
indexRouter.get("/membership", controller.updateMembershipGet);
indexRouter.post("/membership", controller.updateMembershipPost);
indexRouter.get("/create-message", controller.createMessageGet);
indexRouter.post("/create-message", controller.createMessagePost);
indexRouter.get('/', controller.indexPageGet);


module.exports = indexRouter;
import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", authController.createUser);

authRouter.post("/login", passportLocal, authController.login);

export default authRouter;

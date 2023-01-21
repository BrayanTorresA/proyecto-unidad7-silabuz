import { Router } from "express";
import { store, login } from "./controller";

const userRouter: Router = Router();

userRouter.post("/", store);
userRouter.post("/login", login);

export default userRouter;

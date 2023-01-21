import { Router } from "express";
import { verifyToken } from "../middleware";
import { store, login, findUser } from "./controller";

const userRouter: Router = Router();

userRouter.post("/", store);
userRouter.get("/:id", verifyToken, findUser);
userRouter.post("/login", login);

export default userRouter;

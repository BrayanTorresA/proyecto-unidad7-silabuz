import { Router } from "express";
import { verifyToken } from "../middleware";
import {
  store,
  findAllPublicSongs,
  findAllSongs,
  findOneSong,
} from "./controller";

const songRouter: Router = Router();

songRouter.post("/",store);
songRouter.get("/",findAllPublicSongs);
songRouter.get("/all",verifyToken,findAllSongs);
songRouter.get("/:id",verifyToken,findOneSong);

export default songRouter;

import { Router } from "express";
import { verifyToken } from "../middleware";
import {store,findAll,addSongToPlaylist} from "./controller"

const playlistRouter: Router = Router();

playlistRouter.post("/",verifyToken,store);
playlistRouter.get("/",findAll);
playlistRouter.put("/add-song",verifyToken,addSongToPlaylist);

export default playlistRouter;
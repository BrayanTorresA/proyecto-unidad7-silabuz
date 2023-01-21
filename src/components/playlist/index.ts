import { Router } from "express";
import { verifyToken } from "../middleware";
import {
  store,
  findAll,
  addSongToPlaylist,
  findUserPlaylists,
} from "./controller";

const playlistRouter: Router = Router();

playlistRouter.post("/", verifyToken, store);
playlistRouter.get("/", findAll);
playlistRouter.get("/user/:idUser", findUserPlaylists);
playlistRouter.put("/add-song", verifyToken, addSongToPlaylist);

export default playlistRouter;

import express, { type Application } from "express";
import { userRouter,songRouter,playlistRouter} from "./components/index";
import cors from "cors";

const app: Application = express();

//middlewares
app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/songs", songRouter);
app.use("/api/v1/playlist", playlistRouter);

export default app;

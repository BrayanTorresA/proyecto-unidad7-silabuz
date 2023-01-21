import express, { application, Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import * as jwt from "jsonwebtoken";

import { verifyToken } from "./middleware";

import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app: Express = express();

const PORT = process.env.PORT;
app.use(cors({ origin: "*" }));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Usando Typescript y Express");
});

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});

//Usuarios

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, date_born } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        date_born: new Date(date_born),
      },
    });
    res.status(201).json({ message: "user created successfully", info: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//Login usuarios

app.post("/api/v1/users/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ auth: false, message: "Incorrect password" });
    }

    const token = jwt.sign(user, process.env.TOKEN_SECRET!, {
      expiresIn: 60 * 60 * 24,
    });
    res.json({ auth: true, token });
  } catch (error) {
    res.status(500).json({ auth: false, message: error });
  }
});

//Crear Canción

app.post("/api/v1/songs", async (req: Request, res: Response) => {
  try {
    const { name, artist, album, year, genre, duration, is_public } = req.body;
    const song = await prisma.song.create({
      data: {
        name,
        artist,
        album,
        year,
        genre,
        duration,
        is_public,
      },
    });

    res.status(201).json({ message: "created successfully", info: song });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//Listar Canciones publicas
app.get("/api/v1/songs", async (_req: Request, res: Response) => {
  try {
    const publicSongs = await prisma.song.findMany({
      where: { is_public: true },
    });
    res.json(publicSongs);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//listar todas las canciones(incluida las privadas)
app.get(
  "/api/v1/songs/all",
  verifyToken,
  async (_req: Request, res: Response) => {
    try {
      const songs = await prisma.song.findMany();
      res.json(songs);
    } catch (error) {}
  }
);

//Listar cancion por id
app.get(
  "/api/v1/songs/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const result = await prisma.song.findUnique({
        where: {
          id,
        },
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

//Crear playlist

app.post("/api/v1/playlist", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const playlist = await prisma.playlist.create({
      include: {
        songs: true,
      },
      data: {
        name: data.name,
        user: { connect: { id: data.user_id } },
        songs: {
          create: data.songs,
        },
      },
    });

    res
      .status(201)
      .json({ message: "playlist created successfully ", info: playlist });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//Listar playlists
app.get("/api/v1/playlist", async (_req: Request, res: Response) => {
  try {
    const playlists = await prisma.playlist.findMany({
      select: {
        id: true,
        name: true,
        user_id: true,
        songs: true,
      },
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// app.delete("/api/v1/playlist/delete", async (_req: Request, res: Response) => {
//   const results = await prisma.playlist.deleteMany();

//   res.json(results);
// });

//Agregar cancion a un playlist

app.put("/api/v1/playlist/add", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const playlist = await prisma.playlist.update({
      where: {
        id: data.id_playlist,
      },
      include: {
        songs: true,
      },
      data: {
        songs: { connect: { id: data.id_song } },
      },
    });

    res.json({ message: "song added successfully", info: playlist });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

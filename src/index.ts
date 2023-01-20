import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import * as jwt from "jsonwebtoken";

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
  const { name, email, password } = req.body;
  const last_session = new Date();
  const update_at = new Date();
  const date_born = new Date();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      last_session,
      update_at,
      date_born,
    },
  });
  res.status(201).json(user);
});

//Login usuarios

app.post("/api/v1/users/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ auth: false, message: "Incorrect password" });
  }

  const token = jwt.sign(user, process.env.TOKEN_SECRET!, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

//Crear Canción

app.post("/api/v1/songs", async (req: Request, res: Response) => {
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

  res.status(201).json(song);
});

//Listar Canciones
app.get("/api/v1/songs", async (_req: Request, res: Response) => {
  const results = await prisma.song.findMany({
    where: { is_public: true },
  });
  res.json(results);
});

//Listar cancion por id
app.get("/api/v1/songs/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const result = await prisma.song.findUnique({
    where: {
      id,
    },
  });
  res.json(result);
});

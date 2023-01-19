import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app: Express = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Usando Typescript y Express");
});

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});

//Usuarios

app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { name, email, password} = req.body;
  const last_session = new Date();
  const update_at = new Date();
  const date_born = new Date()
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      last_session,
      update_at,
      date_born
    },
  });
  res.status(201).json(user);
});

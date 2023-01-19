import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app: Express = express();

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Usando Typescript y Express");
});

app.listen(PORT,()=>{
    console.log(`Servidor en el puerto ${PORT}`)
})

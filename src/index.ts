// import express, { application, Express, Request, Response } from "express";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});

import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

export const store = async (req: Request, res: Response): Promise<void> => {
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
};

export const login = async (req: Request, res: Response)=> {
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
};

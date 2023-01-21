import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const playlist = await prisma.playlist.create({
      include: {
        songs: true,
      },
      data: {
        name: data.name,
        user: { connect: { id: data.user_id } },
        // songs: {
        //   create: data.songs,
        // },
      },
    });

    res
      .status(201)
      .json({ message: "playlist created successfully ", info: playlist });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const findAll = async (_req: Request, res: Response): Promise<void> => {
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
};

export const addSongToPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    res.json({
      message: "song added to playlist successfully",
      info: playlist,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

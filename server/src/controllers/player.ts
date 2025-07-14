import { RequestHandler } from "express";
import Player from "../models/players";

interface iPlayer {
  _id: string;
  name: string;
  goals?: number;
  assists?: number;
}

export const getAllPlayers:RequestHandler = async (req, res, next) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        next(error);
    }
}

export const getPlayerById:RequestHandler<{id:string},unknown,unknown,unknown> = async (req, res, next) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json(player);
    } catch (error) {
        next(error);
    }
}

export const createPlayer:RequestHandler<{id:string},unknown,unknown,unknown> = async (req, res, next) => {
    try {
        const newPlayer = new Player(req.body);
        const savedPlayer = await newPlayer.save();
        res.status(201).json(savedPlayer);
    } catch (error) {
        next(error);
    }
}

export const updatePlayer:RequestHandler<{id:string},unknown,iPlayer,unknown> = async (req, res, next) => {
    try {
        const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json(updatedPlayer);
    } catch (error) {
        next(error);
    }
}

export const deletePlayer:RequestHandler<{id:string},unknown,unknown,unknown> = async (req, res, next) => {
    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
        if (!deletedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        next(error);
    }
}
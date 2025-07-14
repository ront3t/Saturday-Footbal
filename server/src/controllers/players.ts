import { RequestHandler } from "express";
import Player from "../models/players";

interface IPlayer {
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

export const createPlayer:RequestHandler<unknown, unknown,IPlayer,unknown> = async (req, res, next) => {
    try {
        const {name} = req.body;
        
        const newPlayer = await Player.create({name});
        const savedPlayer = await newPlayer.save();
        
        res.status(201).json(savedPlayer);
    } catch (error) {
        next(error);
    }
}

export const updatePlayer:RequestHandler<{id:string},unknown,IPlayer,unknown> = async (req, res, next) => {
    try {
        const {name, goals, assists} = req.body;
        const id = req.params.id;
        const player = await Player.findById(id)
        
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        player.name = name || player.name;
        player.goals = goals !== undefined ? goals : player.goals;
        player.assists = assists !== undefined ? assists : player.assists;

        const updatedPlayer = await player.save();
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
        res.status(204).json({ message: "Player deleted successfully" });
    } catch (error) {
        next(error);
    }
}
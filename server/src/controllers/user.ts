import { RequestHandler } from "express";
import UserModel from "../models/User";

export const getAllUsers:RequestHandler = async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUserById:RequestHandler<{id:string},unknown,unknown,unknown> = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


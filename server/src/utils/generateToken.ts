import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateTokenAndSetCookie = (userId: Types.ObjectId, res: Response) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId }, secret, {
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, //prevent xss attacks
        sameSite: "strict", //CSRF attack: cross-site request forgery attacks
        secure: process.env.NODE_ENV !=="development"
    });
};

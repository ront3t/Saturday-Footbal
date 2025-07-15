import { RequestHandler } from "express";
import jwt from "jsonwebtoken"
import User from "../models/user";
import { Types } from "mongoose";


export const protectRoute:RequestHandler = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token)
            return res.status(401).json({error:"Unauthorized! no token provided"});

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jwt.verify(token, secret) as { userId: Types.ObjectId };
        if(!decoded)
            return res.status(401).json({error:"Unauthorized: Invalid Token"});

        const user = await User.findById(decoded.userId).select("-password");
        if(!user)
            return res.status(404).json({error:"User not found"});

        req.user = user;
        next();

    }catch (err) {
        next(err)
    }
}
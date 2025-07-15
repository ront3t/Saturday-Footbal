import bcrypt from "bcrypt";
import UserModel from "../models/user";
import { RequestHandler } from "express";
import { generateTokenAndSetCookie } from "../utils/generateToken";


/*USER INTERFACE */
interface IUser{
    username:string
    fullname:string
    password:string
    email:string
    role: 'user' | 'admin' | 'superadmin'
}

/* REGISTER USER */
export const register:RequestHandler<unknown, unknown, IUser, unknown>  = async (req, res, next) => {
  const {
    username,
    fullname,
    password,
    email,
  } = req.body;

  try {
    const exitingUser = await UserModel.findOne({username})
    if(exitingUser)
      return res.status(400).json({error:"username already exists"})

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email))
      return res.status(400).json({error:"invalid Email format"})
    if (password.length<5)
      return res.status(400).json({error:"password is too short"})

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      username,
      fullname,
      password: passwordHash,
      email,
    });

    if (newUser)
    {
      generateTokenAndSetCookie(newUser._id,res);
      await newUser.save();
      res.status(201).json(newUser);
    }
    
  }catch (err) {
    next(err)
  }
}

export const login:RequestHandler = async (req, res, next) => {
  try {
      const {username,password} = req.body;
      const user = await UserModel.findOne({username});
      if(!user)
        return res.status(400).json({error:"invalid username"})
      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if(!isPasswordCorrect)
        return res.status(400).json({error:"invalid password"})

      generateTokenAndSetCookie(user._id,res)
      res.status(200).json(user);
  } catch (err) {
    next(err)
  }
};

export const logout:RequestHandler = async (req,res, next) => {
  try {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({message:"Logout successfully"})
  } catch (err) {
    next(err)
  }
}

export const getMe:RequestHandler = async (req,res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    next(err)
  }
}


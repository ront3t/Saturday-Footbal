import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import dotenv from "dotenv"
import morgan from 'morgan'
import createHttpError, {isHttpError} from 'http-errors'
import cors from 'cors'


///configurations
const app = express()
app.use(express.json())

dotenv.config()

app.use(morgan('dev'));
app.use(cors())

///Routes

app.use( (req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))  
})

app.use((error:unknown,req:Request, res:Response, next:NextFunction) => {
  let errorMessage = "ohhh no! something went wrong";
  let statusCode = 500;
  if (isHttpError(error))
  {
    statusCode = error.status
    errorMessage = error.message
  }
  res.status(statusCode).json({ error:errorMessage})
})

export default app

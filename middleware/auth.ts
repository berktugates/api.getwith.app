import { NextFunction, Request,Response } from "express"
import jwt from "jsonwebtoken"
import { sendErrorResponse } from "../helpers/sendErrorResponse"

export const authMiddleware = async(req:Request,res:Response, next:NextFunction)=>{
    try{
        const token = req.header("getwith-auth-token");
        if(!token){
            sendErrorResponse(res,401, "Authentication required: No token provided.");
            return;
        }
        const decoded = await jwt.verify(token, process.env.JWT_TOKEN_KEY as string);
        req.user = decoded;
        next();
    }catch(err){
        sendErrorResponse(res, 500, err);
    }
}
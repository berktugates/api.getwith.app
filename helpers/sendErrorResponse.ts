import { Response } from "express";

export const sendErrorResponse = (res:Response, statusCode:number, errMsg:string)=>{
    return res.status(statusCode).send(errMsg);
}
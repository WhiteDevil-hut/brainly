import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
const JWT_KEY="Hello";
export const middleware=(req:Request,res:Response,next:NextFunction)=>{
     try {
        const token=req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"No token"});
        }
        const decoded=jwt.verify(token,JWT_KEY) as {id:string};
        //@ts-ignore
        req.userid=decoded.id;
        next();
    } catch(err){
        res.status(401).json({message:"Invalid token"});
    }
}

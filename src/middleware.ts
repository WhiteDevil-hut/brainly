import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
const JWT_KEY = "Hello";
export const middleware=(req:Request,res:Response,next:NextFunction)=>{
    try {
        let token=req.headers.authorization;
        if(!token){
            console.error("No token provided");
            return res.status(401).json({ message: "No token" });
        }
        if(token.startsWith("Bearer ")){
            token = token.slice(7);
        }
        console.log("Token provided:", token); // Log the token to ensure it's being sent
        const decoded=jwt.verify(token,JWT_KEY) as {id:string};
        //@ts-ignore
        req.userid=decoded.id;
        //@ts-ignore
        console.log("Decoded ID:",req.userid);  // Log the decoded ID
        next();
    } catch(err){
        console.error("Error verifying token:", err);  // Log the error from jwt.verify
        res.status(401).json({ message: "Invalid token" });
    }
};

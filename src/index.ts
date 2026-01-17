import express from "express";
import jwt from "jsonwebtoken";
import { UserModel,ContentModel } from "./db.js";
import bcrypt from 'bcrypt';
import { middleware } from "./middleware.js";
const JWT_KEY="Hello";
const app=express();
app.use(express.json());
app.post("/api/v1/signup",async (req,res)=>{
    try{
        const username=req.body.username;
        const password=req.body.password;
        const userexists=await UserModel.findOne({username});
        if(userexists){
            return res.status(400).json({message:"User already there"});
        }     
        const hashedpassword=await bcrypt.hash(password,10);
        await UserModel.create({
            username:username,
            password:hashedpassword
        });
        res.status(201).json({message:"Success"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
})
app.post("/api/v1/signin",async(req,res)=>{
    try{
        const {username,password}=req.body;
        if (!username||!password) {
        return res.status(400).json({ message: "Username and password required" });
        }
        const user=await UserModel.findOne({username});
        if (!user){
        return res.status(403).json({ message:"User not found"});
        }
        const passmatch=await bcrypt.compare(password,user.password);
        if(!passmatch){
        return res.status(403).json({message:"Incorrect credentials"});
        }
        const token=jwt.sign({id:user._id },JWT_KEY);
        return res.json({token});
  }
  catch(err){
        console.error("Signin error:", err);
        return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/v1/content",middleware,async (req,res)=>{
    const link=req.body.link;
    const type=req.body.type;
    const title=req.body.title;
    const tags=req.body.tags;
    //@ts-ignore
    const userId=req.userid;
    const content=await ContentModel.create({
        //@ts-ignore
        link,
        type,
        title,
        tags,
        userId
    });
    return res.status(201).json({message:"content created",content});
});
app.get("/api/v1/content",middleware,async (requestAnimationFrame,res)=>{
    try{
        //@ts-ignore
        const userId=req.userid;
        const userexist=await ContentModel.findOne({
            userId
        })
        res.status(200).json(userexist)
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
})
app.delete("/api/v1/content",middleware,async(req,res)=>{
  try {
    //@ts-ignore
    const userId=req.userid;
    const contentid=req.body.contentid;
    console.log("Deleting contentId:", contentid, "for userId:", userId);
    const result = await ContentModel.deleteOne({ userId, _id: contentid });
    console.log("Delete result:", result);
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error("Error in DELETE /content:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/v1/brain/share",(req,res)=>{

})
app.get("/api/v1/brain/:shareLink",(req,res)=>{

})
app.listen(3000,()=>{
    console.log("Server is running on localhost:3000")
});
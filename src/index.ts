import express from "express";
import jwt from "jsonwebtoken";
import { UserModel,ContentModel,LinkModel } from "./db.js";
import bcrypt from 'bcrypt';
import { middleware } from "./middleware.js";
import { random } from "./utils.js";
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
app.get("/api/v1/content", middleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userid;
        const contents = await ContentModel.find({ userId });

        // If content is not found, return an appropriate message
        if (!contents) {
            return res.status(404).json({ message: "No content found for this user" });
        }

        res.status(200).json(contents);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

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
app.post("/api/v1/brain/share",middleware,async (req,res)=>{
   const share=req.body.share;
    if(share ){
        const existinglink=await LinkModel.findOne({
            //@ts-ignore
            userId:req.userid
        });
        if(existinglink){
            res.json({
                hash:existinglink.hash
            })
            return;
        }
        const hash=random(10);

        await LinkModel.create({
            //@ts-ignore
            userId:req.userid,
            hash
        })
        res.json({
            hash
        })
    }
    else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId:req.userid
        });
    }
})
app.get("/api/v1/brain/:shareLink",async (req,res)=>{
    const hash=req.params.shareLink;
    const link= await LinkModel.findOne({
        hash
    });
    if(!link){
        res.status(411).json({
            message:"Sorry incorrect input"
        })
        return;
    }
    //userId
    const content=await ContentModel.find({
        userId:link.userId
    })
    const user=await UserModel.findOne({
            _id:link.userId 
        })
    if(!user){
            return res.status(411).json({
                message:"Sorry user not found"
            });
    }
    res.json({
        username:user.username,
        content:content
    })
})
app.listen(3000,()=>{
    console.log("Server is running on localhost:3000")
});
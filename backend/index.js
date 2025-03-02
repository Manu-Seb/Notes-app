require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full name is required" });
    }
    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ error: true, message: "User already exists" });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000mins" });

    return res.json({ error: false, user, accessToken, message: "Registration successful" });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    if (!password) return res.status(400).json({ message: "Password is required" });

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = {
            user: userInfo
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600m" });

        return res.json({
            error: false,
            message: "Login successful",
            email,
            accessToken,
        });
    } else {
        return res.json({
            error: true,
            message: "Login failed",
        });
    }
});

app.get("/get-user",authenticateToken,async(req,res)=>{
    const {user}=req.user;

    const isUser=await User.findOne({_id:user._id});

    if(!isUser){ 
        return res.sendStatus(401);

    }

    return res.json({
        user:{
            fullName:isUser.fullName,
            email:isUser.email,
            "_id":isUser._id,
            createdOn:isUser.createdOn
        },
            message:"user retrived successfully"
    });
});

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user.user; // Access the nested user object

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is Required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is Required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id, // Correctly access the userId
        });

        await note.save();

        return res.json({
            error: false,
            message: "Successfully added"
        });
    } catch (error) {
        console.error("Error saving note:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user.user; // Access the nested user object

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No message provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(400).json({ error: true, message: "Note not found" });
        }

        if (title) {
            note.title = title;
        }
        if (content) {
            note.content = content;
        }
        if (tags) {
            note.tags = tags;
        }
        if (isPinned !== undefined) {
            note.isPinned = isPinned;
        }

        await note.save();

        return res.json({ error: false, note, message: "Note saved" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal exception occurred" });
    }
});

app.get("/get-all-notes",authenticateToken,async(req,res)=>{
    const {user}=req.user;

    try{
        const notes=await Note.find({userId:user._id}).sort({isPinned:-1});

        return res.json({error:false,notes,message:"notes returned successfully"});
    }
    catch(error){
        return res.status(500).json({error:true,message:"Internal exception occurred"});
    }
});

app.delete("/delete-note/:noteId",authenticateToken,async(req,res)=>{
    const noteId=req.params.noteId;
    const {user}=req.user;

    try{
        const note=await Note.findOne({_id:noteId,userId:user._id});


        if(!note){
            return res.status(400).json({error:true,message:"note not found"});
        }
        await Note.deleteOne({_id:noteId,userId:user._id});

        return res.json({error:false,message:"successfully deleted"});
    }
    catch(error){
        return res.error(500).json({error:true,message:"Internal Error Occurred"}); 
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { isPinned } = req.body;
    const noteId = req.params.noteId;

    try {
        const note = await Note.findOne({ userId: user._id, _id: noteId });

        if (!note) {
            return res.status(400).json({ error: true, message: "note not found" });
        }

        note.isPinned = isPinned; // Unconditional assignment
        await note.save();

        return res.json({ error: false, message: "pinned status changed" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "internal exception occurred" });
    }
});

app.get("/search-notes/",authenticateToken,async(req,res)=>{
    const {user}=req.user;
    const {query}=req.query;

    if(!query){
        return res.status(400).json({error:true,message:"search query is required"});
    }

    try{
        const matchingNotes=await Note.find({userId:user._id,$or:[{title:{$regex:new RegExp(query,"i")}},
            {content:{$regex:new RegExp(query,"i")}},
        ],});

        return res.json({error:false,matchingNotes,message:"Notes matching the query are returned"})

    }
    catch(error){
        return res.status(500).json({error:true,message:"internal exception occurred"});
    }
})

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});




app.listen(8000);

module.exports = app;
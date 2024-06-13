require("dotenv").config()

const config = require("./config.json")
const mongoose = require("mongoose")
mongoose.connect(config.connectionString)

const User = require("./models/userModels")
const Note = require("./models/noteModels")

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken")
const {authenticationToken} = require("./utilities")

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async(req, res) => {
    const {fullName, email, password} = req.body;
    if(!fullName){
        return res.status(400).json({error: true, message: "Please enter your Full Name"})
    }
    if(!email){
        return res.status(400).json({error: true, message: "Please enter your Email"})
    }
    if(!password){
        return res.status(400).json({error: true, message: "Please enter your password"})
    }
    const isUser = await User.findOne({email: email});

    if(isUser){
        return res.json({
            error: true,
            message: "User already exists",
        })
    }
    const user = new User({ fullName, email, password })
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    })
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Done Successfully"
    })
})

app.post("/login", async(req, res) => {
    const {email, password} = req.body;
    if(!email){
        return res.status(400).json({error: true, message: "Please enter your Email"})
    }
    if(!password){
        return res.status(400).json({error: true, message: "Please enter your password"})
    }
    const userInfo = await User.findOne({email: email});
    if(!userInfo){
        return res.status(400).json({message: "User not Found"})
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        })
        return res.json({
            error: false,
            email,
            accessToken,
            message: "Login Succesfull"
        })
    }else {
        return res.status(400).json({
            error: true,
            message: "Please provide valid credentials"
        })
    }
})

app.get("/get-user", authenticationToken, async(req, res) => {
    const {user} = req.user;
    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401)
    }
    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        },
        message: "Some error occured please try again later"
    })
})

app.post("/add-note", authenticationToken, async(req, res) => {
    const {title, content} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({error: true, message: "Please enter the Title"})
    }
    if(!content){
        return res.status(400).json({error: true, message: "Please enter the content"})
    }

    try{
        const note = new Note({
            title, content, userId: user._id,
        })

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added"
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.put("/edit-note/:noteId", authenticationToken, async(req, res) => {
    const noteId = req.params.noteId;
    const {title, content, isPinned} = req.body;
    const{user} = req.user; 
    
    if(!title && !content){
        return res.status(400).json({error: true, message: "No changes done"})
    }
    try{
        const note = await Note.findOne({_id: noteId, userId: user._id})
        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }
        if(title) note.title = title
        if(content) note.content = content
        if(isPinned) note.isPinned = isPinned

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note Updated"
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.get("/get-all-notes", authenticationToken, async(req, res) => {
    const {user} = req.user;

    try{
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1})
        return res.json({
            error: false,
            notes,
            message: "Fetched all notes"
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.delete("/delete-note/:noteId", authenticationToken, async(req, res) => {
    const noteId = req.params.noteId;
    const{user} = req.user; 
    try{
        const note = await Note.find({_id: noteId, userId: user._id})
        if(!note){
            return res.status(400).json({error: true, message: "No changes done"})
        }
        await Note.deleteOne({_id: noteId, userId: user._id})
        return res.json({
            error: false,
            message: "Note deleted"
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
    
})

app.put("/update-pinned-note/:noteId", authenticationToken, async(req, res) => {
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const{user} = req.user; 
    
    try{
        const note = await Note.findOne({_id: noteId, userId: user._id})
        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }
        
        note.isPinned = isPinned || false;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note Updated"
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.get("/search-notes", authenticationToken, async(req, res) => {
    const{user} = req.user; 
    const {query} = req.query
    
    if(!query){
        return res.status(400).json({error: true, message: "Search Query is required"})
    }
    
    try{
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                {title: {$regex: new RegExp(query, "i")}},
                {content: {$regex: new RegExp(query, "i")}}
            ]
        })

        
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Note Updated"
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.listen(8000);

module.exports = app;

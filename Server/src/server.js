import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectMongoDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
})


console.log("this server page ")

connectMongoDB().then(()=>{
    app.on('error',(error)=>{
        console.log("Error to connect server: ", error);
        process.exit(1);
        
    })

    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })

})


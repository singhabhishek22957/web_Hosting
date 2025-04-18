import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))

console.log("process.env.CORS_ORIGIN: ", process.env.CORS_ORIGIN);  




app.use(express.json({
    limit:"16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit:"16kb"
}))

app.use(express.static("public"));

app.use(cookieParser());


app.get("/", (req, res)=>{
    res.send("Server is running");
})


import userRouter from "./routes/user.router.js"
app.use("/user",userRouter);


export {
    app
}
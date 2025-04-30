import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";



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


// Schedule the cron job to move unaccepted donations every hour
cron.schedule("0 * * * *", moveUnacceptedDonations);


import userRouter from "./routes/user.router.js"
app.use("/user",userRouter);

import charityRoute from "./routes/charity.router.js"
app.use("/charity",charityRoute);


import addressRouter from "./routes/address.router.js"
import { moveUnacceptedDonations } from "./controllers/NotAcceptedByCharity.js";
app.use("/address",addressRouter);


import donationRouter from "./routes/donation.router.js"
app.use("/donation",donationRouter);


export {
    app
}
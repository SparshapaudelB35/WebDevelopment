import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/index.js";
import { userRouter } from "./route/index.js";
import { authRouter } from "./route/index.js";
import { productRouter } from "./route/index.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import cors from 'cors';


dotenv.config();


const app=express();
app.use(cors());

app.use(bodyParser.json());


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use(authenticateToken);
app.use('/api/product',productRouter)
const port = process.env.PORT;  

app.listen(port, function () {
  console.log("Project running on port", port);
  db();
})
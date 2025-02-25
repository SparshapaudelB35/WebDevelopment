import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/index.js";
import { userRouter } from "./route/index.js";
import { authRouter } from "./route/index.js";
import { productRouter } from "./route/index.js";
import path from 'path'; 
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import cors from 'cors';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use(authenticateToken);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  
app.use('/api/product', productRouter);

const port = process.env.PORT;  

app.listen(port, function () {
  console.log("Project running on port", port);
  db();
});

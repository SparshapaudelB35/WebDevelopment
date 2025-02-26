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
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use(authenticateToken);
app.use('/api/product', productRouter);

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log("Project running on port", port);
  db();
});

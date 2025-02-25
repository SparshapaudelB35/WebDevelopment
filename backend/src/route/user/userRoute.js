import express from 'express'
import { UserController } from '../../controller/index.js';
const router=express.Router();
router.get("/",UserController.getAll);
router.post("/create",UserController.create);
router.patch("/:id",UserController.update);
router.get("/:id",UserController.getById);
router.delete("/:id",UserController.deleteById);



export  {router as userRouter };




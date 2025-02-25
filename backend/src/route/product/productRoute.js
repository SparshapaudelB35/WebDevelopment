import express from 'express'
import { productController } from '../../controller/index.js';
const router=express.Router();
router.get("/",productController.getAll);
router.post("/",productController.add);
router.patch("/:id",productController.update);
router.get("/:id",productController.getById);
router.delete("/:id",productController.delelteById);

export  {router as productRouter };




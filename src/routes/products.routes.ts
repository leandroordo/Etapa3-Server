import express, { NextFunction } from "express";
import {
  getAllProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";
import multer from "multer";

var productsRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

productsRouter
  .get("/", getAllProducts) //GET all products
  .post("/", upload.single("photo"), addProduct) //POST a new product
  .get("/:id", getProduct) //GET a product by id
  .put("/:id", updateProduct) //PUT to update a product
  .delete("/:id", deleteProduct); //DELETE a product

export default productsRouter;

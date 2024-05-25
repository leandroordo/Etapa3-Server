import express, { NextFunction } from "express";
import {
  getAllProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";

var productsRouter = express.Router();

productsRouter
  .get("/", getAllProducts) //GET all products
  .post("/", addProduct) //POST a new product
  .get("/:id", getProduct) //GET a product by id
  .put("/:id", updateProduct) //PUT to update a product
  .delete("/:id", deleteProduct); //DELETE a product

export default productsRouter;

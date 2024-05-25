import express from "express";
import {
  getCart,
  createCart,
  updateCart,
  deleteCart,
} from "../controllers/cartController";

var cartRouter = express.Router();

cartRouter
  .post("/", createCart) //POST a ner cart and return cart id
  .get("/:id", getCart) //GET cart products by cart id
  .put("/:id", updateCart) //PUT to update products in a cart
  .delete("/:id", deleteCart); //DELETE a cart

export default cartRouter;

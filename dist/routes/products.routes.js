"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controllers/productsController");
var productsRouter = express_1.default.Router();
productsRouter
    .get("/", productsController_1.getAllProducts) //GET all products
    .post("/", productsController_1.addProduct) //POST a new product
    .get("/:id", productsController_1.getProduct) //GET a product by id
    .put("/:id", productsController_1.updateProduct) //PUT to update a product
    .delete("/:id", productsController_1.deleteProduct); //DELETE a product
exports.default = productsRouter;

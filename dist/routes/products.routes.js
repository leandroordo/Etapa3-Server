"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controllers/productsController");
const multer_1 = __importDefault(require("multer"));
var productsRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
productsRouter
    .get("/", productsController_1.getAllProducts) //GET all products
    .post("/", upload.single("photo"), productsController_1.addProduct) //POST a new product
    .get("/:id", productsController_1.getProduct) //GET a product by id
    .put("/:id", productsController_1.updateProduct) //PUT to update a product
    .delete("/:id", productsController_1.deleteProduct); //DELETE a product
exports.default = productsRouter;

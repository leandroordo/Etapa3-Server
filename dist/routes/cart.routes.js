"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
var cartRouter = express_1.default.Router();
cartRouter
    .post("/", cartController_1.createCart) //POST a ner cart and return cart id
    .get("/:id", cartController_1.getCart) //GET cart products by cart id
    .put("/:id", cartController_1.updateCart) //PUT to update products in a cart
    .delete("/:id", cartController_1.deleteCart); //DELETE a cart
exports.default = cartRouter;

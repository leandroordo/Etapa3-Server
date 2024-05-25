"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_routes_1 = __importDefault(require("./products.routes"));
const messages_routes_1 = __importDefault(require("./messages.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const routes = express_1.default.Router();
/** GET /health-check - Ver el estado del servicio */
routes.get("/health-check", (req, res) => res.send("OK"));
// Endpoint /products
routes.use("/products", products_routes_1.default);
// Endpoint /messages
routes.use("/messages", messages_routes_1.default);
// Endpoint /cart
routes.use("/cart", cart_routes_1.default);
exports.default = routes;

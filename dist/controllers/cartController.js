"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCart = exports.updateCart = exports.getCart = exports.createCart = void 0;
const utils_1 = require("../lib/utils");
const model_1 = require("../lib/model");
const validation_1 = require("../lib/validation");
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.productId) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El contenido está vacío",
        });
        return;
    }
    try {
        const { productId, quantity } = req.body;
        const validatedFields = validation_1.addCartSchema.safeParse({
            productId,
            quantity,
        });
        if (!validatedFields.success) {
            res.status(http_status_1.default.BAD_REQUEST).send({
                errors: validatedFields.error.flatten().fieldErrors,
            });
            return;
        }
        (0, utils_1.connectToDB)();
        const newCart = new model_1.Cart({
            products: [
                {
                    productId,
                    quantity,
                },
            ],
        });
        yield newCart.save();
        res.status(http_status_1.default.CREATED).send(newCart);
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al crear el carrito",
        });
    }
});
exports.createCart = createCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartId = req.params.id;
        (0, utils_1.connectToDB)();
        const cart = yield model_1.Cart.findById(cartId);
        if (cart) {
            var productsInCart = cart.products.map((prod) => {
                return {
                    productId: prod.productId,
                    quantity: prod.quantity,
                };
            });
            const productsIds = productsInCart.map((product) => product.productId);
            const products = yield model_1.Product.find({
                _id: { $in: productsIds },
            });
            // Mapear los productos para facilitar la búsqueda
            const productMap = products.reduce((map, product) => {
                map[product._id] = product;
                return map;
            }, {});
            // Mapear los productos en el carrito e incluir los detalles de cada producto
            const cartDetails = productsInCart.map((cartProduct) => {
                const product = productMap[cartProduct.productId];
                return {
                    productId: product.id,
                    name: product.name,
                    quantity: cartProduct.quantity,
                    price: product.price,
                    photo: product.photo.toString("base64"),
                };
            });
            res.status(http_status_1.default.OK).send(cartDetails);
        }
        else {
            res.status(http_status_1.default.NOT_FOUND).send();
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al obtener los datos del carrito",
        });
    }
});
exports.getCart = getCart;
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Validar si hay contenido en el body
    if (!req.body) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El contenido está vacío",
        });
        return;
    }
    const cartId = req.params.id;
    if (!cartId) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El id del carrito es requerido",
        });
        return;
    }
    //Validar si cartId es un ObjectId
    const validatedId = validation_1.mongoObjedIdSchema.safeParse({ id: cartId });
    if (!validatedId.success) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            errors: validatedId.error.flatten().fieldErrors,
        });
        return;
    }
    const products = req.body;
    if (products) {
        for (const product of products) {
            const productId = product.productId;
            const quantity = Number(product.quantity);
            const validatedFields = validation_1.addCartSchema.safeParse({
                productId,
                quantity,
            });
            if (!validatedFields.success) {
                res.status(http_status_1.default.BAD_REQUEST).send({
                    errors: validatedFields.error.flatten().fieldErrors,
                });
                return;
            }
        }
        // Convertir productIds a ObjectId
        const updatedProducts = products.map((product) => ({
            productId: new mongoose_1.default.Types.ObjectId(product.productId),
            quantity: product.quantity,
        }));
        try {
            (0, utils_1.connectToDB)();
            yield model_1.Cart.updateOne({ _id: new mongoose_1.default.Types.ObjectId(cartId) }, { $set: { products: updatedProducts } });
            res.status(http_status_1.default.NO_CONTENT).send();
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
                message: "Error al actualizar el carrito",
            });
        }
    }
    else {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "Los productos son obligatorios",
        });
    }
});
exports.updateCart = updateCart;
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = req.params.id;
    if (!cartId) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El id del carrito es requerido",
        });
        return;
    }
    //Validar si cartId es un ObjectId
    const validatedId = validation_1.mongoObjedIdSchema.safeParse({ id: cartId });
    if (!validatedId.success) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            errors: validatedId.error.flatten().fieldErrors,
        });
        return;
    }
    try {
        (0, utils_1.connectToDB)();
        yield model_1.Cart.findByIdAndDelete(cartId);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
    catch (error) {
        console.log(error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al borrar el carrito",
        });
    }
});
exports.deleteCart = deleteCart;

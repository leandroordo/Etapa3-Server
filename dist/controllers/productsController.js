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
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProduct = exports.getAllProducts = void 0;
const utils_1 = require("../lib/utils");
const model_1 = require("../lib/model");
const validation_1 = require("../lib/validation");
const http_status_1 = __importDefault(require("http-status"));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.connectToDB)();
        const products = yield model_1.Product.find();
        res.status(http_status_1.default.OK).send(products);
    }
    catch (err) {
        console.log(err);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Failed to fech products!",
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        if (!productId) {
            res.status(http_status_1.default.BAD_REQUEST).send({
                message: "El id del producto es requerido",
            });
            return;
        }
        //Validar si productId es un ObjectId
        const validatedFields = validation_1.mongoObjedIdSchema.safeParse({ id: productId });
        if (!validatedFields.success) {
            res.status(http_status_1.default.BAD_REQUEST).send({
                errors: validatedFields.error.flatten().fieldErrors,
            });
            return;
        }
        (0, utils_1.connectToDB)();
        const product = yield model_1.Product.findById(productId);
        if (product) {
            res.status(http_status_1.default.OK).send(product);
        }
        else {
            res.status(http_status_1.default.NOT_FOUND).send({
                message: `No existe el producto con id=${productId}.`,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Failed to fech products!",
        });
    }
});
exports.getProduct = getProduct;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.name) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El contenido está vacío",
        });
        return;
    }
    try {
        const { name, price, stock, brand, category, description, longDescription, freeDelivery, ageFrom, ageTo, photo, } = req.body;
        const validatedFields = validation_1.addProductSchema.safeParse({
            name,
            price,
            stock,
            brand,
            description,
            longDescription,
            ageFrom,
            ageTo,
            photo,
        });
        if (!validatedFields.success) {
            res.status(http_status_1.default.BAD_REQUEST).send({
                errors: validatedFields.error.flatten().fieldErrors,
            });
            return;
        }
        (0, utils_1.connectToDB)();
        const newProduct = new model_1.Product({
            name,
            price,
            stock,
            brand,
            category,
            description,
            longDescription,
            freeDelivery: freeDelivery === "on",
            ageFrom,
            ageTo,
            photo,
        });
        yield newProduct.save();
        res.status(http_status_1.default.CREATED).send(newProduct);
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al crear el producto",
        });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Validar si hay contenido en el body
    if (!req.body) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El contenido está vacío",
        });
        return;
    }
    const productId = req.params.id;
    if (!productId) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El id del producto es requerido",
        });
        return;
    }
    //Validar si productId es un ObjectId
    const validatedId = validation_1.mongoObjedIdSchema.safeParse({ id: productId });
    if (!validatedId.success) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            errors: validatedId.error.flatten().fieldErrors,
        });
        return;
    }
    const { name, price, stock, brand, category, description, longDescription, freeDelivery, ageFrom, ageTo, photo, } = req.body;
    const validatedFields = validation_1.updateProductSchema.safeParse({
        name,
        price,
        stock,
        brand,
        description,
        longDescription,
        ageFrom,
        ageTo,
        photo,
    });
    if (!validatedFields.success) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            errors: validatedFields.error.flatten().fieldErrors,
        });
        return;
    }
    const updateFields = {
        name,
        price,
        stock,
        brand,
        category,
        description,
        longDescription,
        freeDelivery,
        ageFrom,
        ageTo,
        photo,
    };
    Object.keys(updateFields).forEach((key) => (updateFields[key] === "" || undefined) &&
        delete updateFields[key]);
    try {
        (0, utils_1.connectToDB)();
        yield model_1.Product.findByIdAndUpdate(productId, updateFields);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
    catch (error) {
        console.log(error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al actualizar el producto",
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    if (!productId) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El id del producto es requerido",
        });
        return;
    }
    //Validar si productId es un ObjectId
    const validatedId = validation_1.mongoObjedIdSchema.safeParse({ id: productId });
    if (!validatedId.success) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            errors: validatedId.error.flatten().fieldErrors,
        });
        return;
    }
    try {
        (0, utils_1.connectToDB)();
        yield model_1.Product.findByIdAndDelete(productId);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
    catch (error) {
        console.log(error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al borrar el producto",
        });
    }
});
exports.deleteProduct = deleteProduct;

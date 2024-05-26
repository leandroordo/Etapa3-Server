"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = exports.ContactMessage = exports.Product = exports.productInCartSchema = exports.contactMessageSchema = exports.productsSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.productsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 200,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    brand: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    longDescription: {
        type: String,
        required: false,
    },
    freeDelivery: {
        type: Boolean,
        required: false,
        default: false,
    },
    ageFrom: {
        type: Number,
        required: false,
        default: 0,
        min: 0,
        max: 1000,
    },
    ageTo: {
        type: Number,
        required: false,
        default: 1000,
        min: 0,
        max: 1000,
    },
    photo: {
        type: Buffer,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.contactMessageSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 200,
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    telephone: {
        type: String,
        required: false,
        max: 255,
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.productInCartSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});
// Define the Cart schema
const cartSchema = new mongoose_1.Schema({
    products: [exports.productInCartSchema],
}, { timestamps: true });
exports.Product = mongoose_1.default.models.productos || mongoose_1.default.model("productos", exports.productsSchema);
exports.ContactMessage = mongoose_1.default.models.mensajes || mongoose_1.default.model("mensajes", exports.contactMessageSchema);
exports.Cart = mongoose_1.default.models.cart || mongoose_1.default.model("cart", cartSchema);

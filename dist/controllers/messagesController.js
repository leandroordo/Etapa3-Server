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
exports.addContactMessage = void 0;
const utils_1 = require("../lib/utils");
const model_1 = require("../lib/model");
const validation_1 = require("../lib/validation");
const http_status_1 = __importDefault(require("http-status"));
const addContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.name) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            message: "El contenido está vacío",
        });
        return;
    }
    try {
        const { name, email, telephone, message } = req.body;
        const validatedFields = validation_1.addContactMessageSchema.safeParse({
            name,
            email,
            telephone,
            message,
        });
        if (!validatedFields.success) {
            res.status(http_status_1.default.BAD_REQUEST).send({
                errors: validatedFields.error.flatten().fieldErrors,
            });
            return;
        }
        (0, utils_1.connectToDB)();
        const newContactMessage = new model_1.ContactMessage({
            name,
            email,
            telephone,
            message,
        });
        yield newContactMessage.save();
        res.status(http_status_1.default.CREATED).send(newContactMessage);
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
            message: "Error al guardar el mensaje",
        });
    }
});
exports.addContactMessage = addContactMessage;

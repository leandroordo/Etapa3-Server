"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagesController_1 = require("../controllers/messagesController");
var messagesRouter = express_1.default.Router();
messagesRouter.post("/", messagesController_1.addContactMessage); //POST a new contact message
exports.default = messagesRouter;

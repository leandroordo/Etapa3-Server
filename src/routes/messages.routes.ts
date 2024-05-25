import express from "express";
import { addContactMessage } from "../controllers/messagesController";

var messagesRouter = express.Router();

messagesRouter.post("/", addContactMessage); //POST a new contact message

export default messagesRouter;

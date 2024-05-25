import { Request, Response } from "express";
import { connectToDB } from "../lib/utils";
import { ContactMessage, Product } from "../lib/model";
import { addContactMessageSchema, mongoObjedIdSchema } from "../lib/validation";
import httpStatus from "http-status";

export const addContactMessage = async (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El contenido está vacío",
    });
    return;
  }

  try {
    const { name, email, telephone, message } = req.body;

    const validatedFields = addContactMessageSchema.safeParse({
      name,
      email,
      telephone,
      message,
    });

    if (!validatedFields.success) {
      res.status(httpStatus.BAD_REQUEST).send({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    connectToDB();
    const newContactMessage = new ContactMessage({
      name,
      email,
      telephone,
      message,
    });

    await newContactMessage.save();

    res.status(httpStatus.CREATED).send(newContactMessage);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al guardar el mensaje",
    });
  }
};

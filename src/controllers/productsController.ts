import { Request, Response } from "express";
import { connectToDB } from "../lib/utils";
import { Product } from "../lib/model";
import {
  addProductSchema,
  mongoObjedIdSchema,
  updateProductSchema,
} from "../lib/validation";
import httpStatus from "http-status";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    connectToDB();

    const products = await Product.find();
    const productsWithBase64Image = products.map((product) => ({
      ...product._doc,
      photo: product.photo.toString("base64"),
    }));

    res.status(httpStatus.OK).json(productsWithBase64Image);
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Failed to fech products!",
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      res.status(httpStatus.BAD_REQUEST).send({
        message: "El id del producto es requerido",
      });
      return;
    }

    //Validar si productId es un ObjectId
    const validatedFields = mongoObjedIdSchema.safeParse({ id: productId });

    if (!validatedFields.success) {
      res.status(httpStatus.BAD_REQUEST).send({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    connectToDB();

    const product = await Product.findById(productId);
    if (product) {
      res.status(httpStatus.OK).send(product);
    } else {
      res.status(httpStatus.NOT_FOUND).send({
        message: `No existe el producto con id=${productId}.`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Failed to fech products!",
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { body, file } = req;

  if (!body.name) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El contenido está vacío",
    });
    return;
  }
  if (file && !file.buffer) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El contenido de la imagen está vacío",
    });
    return;
  }

  try {
    const {
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
    } = req.body;

    const validatedFields = addProductSchema.safeParse({
      name,
      price,
      stock,
      brand,
      description,
      longDescription,
      ageFrom,
      ageTo,
    });

    if (!validatedFields.success) {
      res.status(httpStatus.BAD_REQUEST).send({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    connectToDB();
    const newProduct = new Product({
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
      photo: file!.buffer,
      contentType: file!.mimetype,
    });

    await newProduct.save();

    res.status(httpStatus.CREATED).send(newProduct);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al crear el producto",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  //Validar si hay contenido en el body
  if (!req.body) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El contenido está vacío",
    });
    return;
  }

  const productId = req.params.id;
  if (!productId) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El id del producto es requerido",
    });
    return;
  }

  //Validar si productId es un ObjectId
  const validatedId = mongoObjedIdSchema.safeParse({ id: productId });

  if (!validatedId.success) {
    res.status(httpStatus.BAD_REQUEST).send({
      errors: validatedId.error.flatten().fieldErrors,
    });
    return;
  }

  const {
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
  } = req.body;

  const validatedFields = updateProductSchema.safeParse({
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
    res.status(httpStatus.BAD_REQUEST).send({
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

  Object.keys(updateFields).forEach(
    (key) =>
      (updateFields[key as keyof typeof updateFields] === "" || undefined) &&
      delete updateFields[key as keyof typeof updateFields]
  );

  try {
    connectToDB();

    await Product.findByIdAndUpdate(productId, updateFields);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al actualizar el producto",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El id del producto es requerido",
    });
    return;
  }

  //Validar si productId es un ObjectId
  const validatedId = mongoObjedIdSchema.safeParse({ id: productId });

  if (!validatedId.success) {
    res.status(httpStatus.BAD_REQUEST).send({
      errors: validatedId.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    connectToDB();

    await Product.findByIdAndDelete(productId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al borrar el producto",
    });
  }
};

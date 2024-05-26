import { Request, Response } from "express";
import { connectToDB } from "../lib/utils";
import { Cart, Product } from "../lib/model";
import { addCartSchema, mongoObjedIdSchema } from "../lib/validation";
import httpStatus from "http-status";
import { CartProduct } from "../types/cart";
import mongoose from "mongoose";

export const createCart = async (req: Request, res: Response) => {
  if (!req.body.productId) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El contenido está vacío",
    });
    return;
  }

  try {
    const { productId, quantity } = req.body as CartProduct;

    const validatedFields = addCartSchema.safeParse({
      productId,
      quantity,
    });

    if (!validatedFields.success) {
      res.status(httpStatus.BAD_REQUEST).send({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    connectToDB();
    const newCart = new Cart({
      products: [
        {
          productId,
          quantity,
        },
      ],
    });

    await newCart.save();

    res.status(httpStatus.CREATED).send(newCart);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al crear el carrito",
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const cartId: string = req.params.id;

    connectToDB();

    const cart = await Cart.findById(cartId);
    if (cart) {
      var productsInCart: CartProduct[] = cart.products.map(
        (prod: CartProduct) => {
          return {
            productId: prod.productId,
            quantity: prod.quantity,
          };
        }
      );

      const productsIds = productsInCart.map((product) => product.productId);
      const products = await Product.find({
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

      res.status(httpStatus.OK).send(cartDetails);
    } else {
      res.status(httpStatus.NOT_FOUND).send();
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al obtener los datos del carrito",
    });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  //Validar si hay contenido en el body
  if (!req.body) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El contenido está vacío",
    });
    return;
  }

  const cartId: string = req.params.id;
  if (!cartId) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El id del carrito es requerido",
    });
    return;
  }

  //Validar si cartId es un ObjectId
  const validatedId = mongoObjedIdSchema.safeParse({ id: cartId });

  if (!validatedId.success) {
    res.status(httpStatus.BAD_REQUEST).send({
      errors: validatedId.error.flatten().fieldErrors,
    });
    return;
  }

  const products = req.body as CartProduct[];

  if (products) {
    for (const product of products) {
      const productId = product.productId;
      const quantity = Number(product.quantity);

      const validatedFields = addCartSchema.safeParse({
        productId,
        quantity,
      });

      if (!validatedFields.success) {
        res.status(httpStatus.BAD_REQUEST).send({
          errors: validatedFields.error.flatten().fieldErrors,
        });
        return;
      }
    }

    // Convertir productIds a ObjectId
    const updatedProducts = products.map((product) => ({
      productId: new mongoose.Types.ObjectId(product.productId),
      quantity: product.quantity,
    }));

    try {
      connectToDB();

      await Cart.updateOne(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $set: { products: updatedProducts } }
      );

      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      console.log(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Error al actualizar el carrito",
      });
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "Los productos son obligatorios",
    });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  const cartId = req.params.id;
  if (!cartId) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: "El id del carrito es requerido",
    });
    return;
  }

  //Validar si cartId es un ObjectId
  const validatedId = mongoObjedIdSchema.safeParse({ id: cartId });

  if (!validatedId.success) {
    res.status(httpStatus.BAD_REQUEST).send({
      errors: validatedId.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    connectToDB();

    await Cart.findByIdAndDelete(cartId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Error al borrar el carrito",
    });
  }
};

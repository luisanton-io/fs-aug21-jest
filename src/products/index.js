import express from "express";
import { ProductModel } from "./model.js";

const productsRouter = express.Router();

productsRouter
  .get("/", async (req, res) => {
    const products = await ProductModel.find({});
    res.send(products);
  })
  .post("/", async (req, res) => {
    const product = new ProductModel(req.body);

    await product.save();
    res.status(201).send(product);
  });

productsRouter
  .put("/:id", async (req, res) => {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (product) {
      res.status(203).send(product);
    } else {
      res.status(404).send({ message: "Product id not available" });
    }
  })
  .get("/:id", async (req, res) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Product id not available" });
    }
  })
  .delete("/:id", async (req, res) => {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(204).send({});
    } else {
      res.status(404).send({ message: "Product id not available" });
    }
  });
export default productsRouter;

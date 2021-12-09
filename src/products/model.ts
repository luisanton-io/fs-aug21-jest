import { ProductSchema } from "./schema";
import mongoose from "mongoose"

export const ProductModel =  mongoose.model("products", ProductSchema);
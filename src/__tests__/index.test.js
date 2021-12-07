import { app } from "../app.js";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const request = supertest(app);

describe("Testing the testing environment", () => {
  it("should check that true is true", () => {
    expect(true).toBe(true);
  });
});

describe("Testing the app endpoints", () => {
  beforeAll((done) => {
    console.log("This gets run before all tests in this suite");

    mongoose.connect(process.env.MONGO_URL_TEST).then(() => {
      console.log("Connected to the test database");
      done();
    });
  });

  it("should check that the GET /test endpoint returns a success message", async () => {
    const response = await request.get("/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test successful");
  });

  const validProduct = {
    name: "Test Product",
    price: 200,
  };

  let _id;
  it("should check that the POST /products endpoint creates a new product", async () => {
    const response = await request.post("/products").send(validProduct);
    _id = response.body._id;
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.price).toBeDefined();
  });

  it("should check that the GET /products endpoint returns a list of products", async () => {
    const response = await request.get("/products");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should check that GET /products/:id gives back a correct product with a valid id", async () => {
    const response = await request.get("/products/" + _id);

    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.price).toBeDefined();
  });

  it("should check that PUT /products/:id gives back a new product with a valid id", async () => {
    const response = await request.put("/products/" + _id).send({
      name: "Test Product Updated",
      price: 300,
    });

    expect(response.status).toBe(203);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe("Test Product Updated");
    expect(response.body.price).toBe(300);
  });

  it("should check that DELETE /products/:id deletes a product", async () => {
    const response = await request.delete("/products/" + _id).send({});

    expect(response.status).toBe(204);
  });

  it("should check that the GET /products/:id endpoint returns a 404 error when the product does not exist", async () => {
    const response = await request.get(`/products/` + _id);

    expect(response.status).toBe(404);
  });

  it("should check that the PUT /products/:id endpoint returns a 404 error when the product does not exist", async () => {
    const response = await request.put(`/products/` + _id).send({
      name: "Test Product Updated",
      price: 300,
    });

    expect(response.status).toBe(404);
  });

  it("should check that the DELETE /products/:id endpoint returns a 404 error when the product does not exist", async () => {
    const response = await request.delete(`/products/` + _id);

    expect(response.status).toBe(404);
  });

  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => {
        done();
      });
  });

  // it("should test that the GET /products endpoint returns a list of products", async () => {})
});

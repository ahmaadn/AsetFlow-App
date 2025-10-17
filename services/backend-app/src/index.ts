// src/index.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

// Impor prisma client dari shared package

const app = express();
const port = 3001;

app.use(express.json());

import { prisma } from "@asetflow/database/"; // Sesuaikan dengan path package database

// Endpoint untuk dokumentasi Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/products", async (req, res) => {
  res.status(201).json({
    message: "Product created successfully",
    product: req.body,
  });
});

app.listen(port, () => {
  console.log(`Backend App running at http://localhost:${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});

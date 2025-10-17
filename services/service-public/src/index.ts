// services/service-public/src/index.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Prisma, prisma } from "@asetflow/database";

const app = express();
const port = 3002;



const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Public API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ["./src/index.ts"],
};
const spec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.get("/products", async (req, res) => {
  const products = await prisma.user.findMany();
  res.json(products);
});

app.listen(port, () => {
  console.log(`Public Service running at http://localhost:${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});

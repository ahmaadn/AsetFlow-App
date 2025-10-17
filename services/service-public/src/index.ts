// services/service-public/src/index.ts
import { prisma } from '@asetflow/database';
import express from 'express';

const app = express();
const port = 3002;

app.get('/products', async (req, res) => {
  const products = await prisma.user.findMany();
  res.json(products);
});

app.listen(port, () => {
  console.log(`Public Service running at http://localhost:${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});

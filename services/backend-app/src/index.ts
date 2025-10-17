// src/index.ts
import { prisma } from '@asetflow/database/';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './swagger';

const app = express();
const port = 3001;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/products', async (req, res) => {
  res.status(201).json({
    message: 'Product created successfully',
    product: req.body,
  });
});

app.listen(port, () => {
  console.log(`Backend App running at http://localhost:${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});

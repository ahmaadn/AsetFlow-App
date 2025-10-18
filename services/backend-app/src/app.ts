import { prisma } from '@asetflow/database';
import express, { Application, Response } from 'express';

export const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Handler untuk route tidak ditemukan
app.use((_req, res: Response) => {
  res.status(404).send({
    message: 'Not Found',
  });
});

export default app;

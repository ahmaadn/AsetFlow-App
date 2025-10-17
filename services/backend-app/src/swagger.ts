import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend App API',
      version: '1.0.0',
      description: 'API documentation for the main backend application',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // Path ke file API
};

export const swaggerSpec = swaggerJsdoc(options);

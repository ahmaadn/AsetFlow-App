import type { Express } from 'express';
import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Backend App API',
    version: '1.0.0',
    description: 'API documentation for the main backend application',
  },
  servers: [
    {
      url: 'http://localhost:8002',
    },
  ],
};

const options: Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/**/*.ts'],
};
const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

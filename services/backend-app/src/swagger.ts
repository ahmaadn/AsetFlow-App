import { Express } from 'express';
import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { ErrorCode } from './utils/error-code.js';

// Swagger definition
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Backend App',
  },
  host: 'localhost:8000',
  basePath: '/v1',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ValidationError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Validation Error',
          },
          ErrorCode: {
            type: 'string',
            enum: Object.values(ErrorCode),
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Title is required',
                },
                value: {
                  type: 'string',
                  example: 'invalid value',
                },
              },
            },
          },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Validation Error',
          },
          ErrorCode: {
            type: 'string',
            enum: Object.values(ErrorCode),
          },
        },
      },
      Authentication: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'JWT Token',
          },
          tokenType: {
            type: 'string',
            example: 'Bearer',
          },
        },
      },
      RegisterUser: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: {
            type: 'string',
            example: 'test@mail.com',
          },
          name: {
            type: 'string',
            example: 'testuser',
          },
          password: {
            type: 'string',
            example: 'testpassword',
          },
        },
      },
      LoginUser: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            example: 'adminpassword',
          },
        },
      },
    },
  },
};

const options: Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/**/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

import { ErrorCode } from '@asetflow/shared';
import { Express } from 'express';
import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AsetFlow API',
    version: '1.0.0',
    description: 'API documentation for the AsetFlow application',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  host: 'localhost:8000',
  basePath: '/v1',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format **Bearer {token}**',
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication information is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
          },
        },
      },
      ValidationError: {
        description: 'The request data is invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
      ApiError: {
        description: 'An unexpected error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
          },
        },
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
            example: 'An unexpected error occurred',
          },
          ErrorCode: {
            type: 'string',
            enum: Object.values(ErrorCode),
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication related endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Assets',
      description: 'Asset management endpoints',
    },
  ],
};

const options: Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/**/*.routes.ts',
    './src/controllers/**/*.ts',
    './src/docs/**/*.yaml',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function createSwaggerDocs(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

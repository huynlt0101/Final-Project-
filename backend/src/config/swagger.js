import swaggerJsdoc from 'swagger-jsdoc';
import config from './index.js';

// Swagger OpenAPI configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description: 'Basic Node.js Express REST API documentation'
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Local development server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;

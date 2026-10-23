import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import config from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description:
        'Node.js Express REST API — Auth, Users, Profile, Categories, Products, Orders, Reviews.'
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Local development server'
      }
    ],
    tags: [
      { name: 'Health', description: 'Health & welcome' },
      { name: 'Auth', description: 'Authentication & password' },
      { name: 'Users', description: 'Admin user management' },
      { name: 'Profile', description: 'Current user profile' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Products', description: 'Products catalog' },
      { name: 'Orders', description: 'Orders & payment status' },
      { name: 'Reviews', description: 'Product reviews' },
      { name: 'Ideas', description: 'Ideas (placeholder)' },
      { name: 'Comments', description: 'Comments (placeholder)' },
      { name: 'Votes', description: 'Votes (placeholder)' },
      { name: 'Notifications', description: 'Notifications (placeholder)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Access token from POST /auth/login'
        }
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            data: { nullable: true }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30, example: 'john_doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: {
              type: 'string',
              format: 'password',
              example: 'Passw0rd!',
              description: 'Min 8 chars with upper, lower, number, special'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'Passw0rd!' }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', format: 'password' },
            newPassword: { type: 'string', format: 'password', example: 'NewPassw0rd!' }
          }
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' }
          }
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: { type: 'string' },
            password: { type: 'string', format: 'password' }
          }
        },
        UserInput: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 }
          }
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 50 },
            email: { type: 'string', format: 'email' },
      
            address: { type: 'string' },
            phone_number: { type: 'string' }
          }
        },
        CategoryInput: {
          type: 'object',
          required: ['category_name'],
          properties: {
            category_name: { type: 'string', example: 'Laptops' },
            description: { type: 'string', example: 'Portable computers' }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['category_id', 'name', 'price', 'stock_quantity'],
          properties: {
            category_id: { type: 'integer', minimum: 1, example: 1 },
            name: { type: 'string', example: 'MacBook Pro' },
            description: { type: 'string' },
            price: { type: 'number', exclusiveMinimum: 0, example: 1299.99 },
            stock_quantity: { type: 'integer', minimum: 0, example: 10 },
            image_url: { type: 'string', nullable: true },
            technical_specs: { type: 'object', nullable: true, additionalProperties: true }
          }
        },
        OrderItem: {
          type: 'object',
          required: ['product_id', 'quantity'],
          properties: {
            product_id: { type: 'integer', minimum: 1 },
            quantity: { type: 'integer', minimum: 1 }
          }
        },
        OrderInput: {
          type: 'object',
          required: ['payment_method', 'shipping_address', 'items'],
          properties: {
            payment_method: { type: 'string', example: 'cod' },
            shipping_address: { type: 'string', example: '123 Main St' },
            payment_status: {
              type: 'string',
              enum: ['pending', 'paid', 'failed', 'refunded'],
              example: 'pending'
            },
            items: {
              type: 'array',
              minItems: 1,
              items: { $ref: '#/components/schemas/OrderItem' }
            }
          }
        },
        PaymentStatusUpdate: {
          type: 'object',
          required: ['payment_status'],
          properties: {
            payment_status: {
              type: 'string',
              enum: ['pending', 'paid', 'failed', 'refunded']
            }
          }
        },
        ReviewInput: {
          type: 'object',
          required: ['product_id', 'rating'],
          properties: {
            product_id: { type: 'integer', minimum: 1 },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', nullable: true }
          }
        },
        ReviewUpdate: {
          type: 'object',
          properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  // Use forward slashes so glob works on Windows
  apis: [path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;

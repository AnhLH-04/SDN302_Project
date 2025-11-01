import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

// Import models first to ensure they are registered
import './models/userModel.js';
import './models/vehicleModel.js';
import './models/batteryModel.js';
import './models/transactionModel.js';
import './models/reviewModel.js';
import './models/paymentModel.js';
import './models/favoriteModel.js';
import './models/reportModel.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import batteryRoutes from './routes/batteryRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Import middlewares
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Swagger JSON endpoint
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger Documentation - MUST be before other routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 30px 0; }
    .swagger-ui .info h2 { color: #3b4151; font-size: 28px; }
    .swagger-ui .info p { font-size: 14px; line-height: 1.6; }
    .swagger-ui .scheme-container { 
      background: #f7f7f7; 
      padding: 15px; 
      border-radius: 4px; 
      margin: 20px 0; 
    }
    .swagger-ui .opblock-tag {
      font-size: 18px;
      font-weight: 600;
      border-bottom: 2px solid #3b4151;
      margin: 20px 0;
      padding: 10px 0;
    }
    .swagger-ui .opblock { 
      border-radius: 4px; 
      margin: 10px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
    .swagger-ui .opblock.opblock-get { border-color: #61affe; }
    .swagger-ui .opblock.opblock-put { border-color: #fca130; }
    .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
    .swagger-ui .btn.authorize { 
      background-color: #49cc90;
      border-color: #49cc90;
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: #3eb87c;
    }
  `,
  customSiteTitle: 'EV Platform API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    },
    tryItOutEnabled: true,
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
    docExpansion: 'list',
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  }
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 EV & Battery Trading Platform API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      batteries: '/api/batteries',
      transactions: '/api/transactions',
      reviews: '/api/reviews',
      admin: '/api/admin',
      docs: '/api-docs',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/batteries', batteryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

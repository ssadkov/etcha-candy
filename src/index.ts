import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';

import { createRoutes } from './routes';
import { CollectionController } from './controllers/CollectionController';
import { TicketController } from './controllers/TicketController';
import { CollectionService } from './services/CollectionService';
import { CandyMachineService } from './services/CandyMachineService';
import { SolanaService } from './services/SolanaService';
import { PlatformConfig } from './types';

class App {
  private app: express.Application;
  private config: PlatformConfig;

  constructor() {
    this.app = express();
    this.config = this.loadConfig();
    this.setupMiddleware();
    this.setupServices();
    this.setupRoutes();
  }

  private loadConfig(): PlatformConfig {
    const configPath = path.join(process.cwd(), 'config', 'platform.json');
    
    if (!fs.existsSync(configPath)) {
      throw new Error('Platform configuration file not found. Please create config/platform.json');
    }

    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: this.config.server.corsOrigin,
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.server.rateLimit.windowMs,
      max: this.config.server.rateLimit.max,
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupServices(): void {
    try {
      // Initialize Solana service
      const solanaService = new SolanaService(this.config);
      
      // Initialize other services
      const collectionService = new CollectionService();
      const candyMachineService = new CandyMachineService(solanaService, collectionService);
      
      // Initialize controllers
      const collectionController = new CollectionController(collectionService, candyMachineService);
      const ticketController = new TicketController(candyMachineService, collectionService, solanaService);
      
      // Store services in app for potential use in routes
      this.app.locals.services = {
        solanaService,
        collectionService,
        candyMachineService,
      };
      
      this.app.locals.controllers = {
        collectionController,
        ticketController,
      };
      
      console.log('Services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private setupRoutes(): void {
    const { collectionController, ticketController } = this.app.locals.controllers;
    
    // API routes
    this.app.use('/api', createRoutes(collectionController, ticketController));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Etcha Candy Backend is running',
        timestamp: new Date().toISOString(),
        config: {
          network: this.config.solana.network,
          platform: this.config.platform.name,
        },
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });

    // Error handler
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    });
  }

  public start(): void {
    const port = process.env.PORT || this.config.server.port;
    
    this.app.listen(port, () => {
      console.log(`🚀 Etcha Candy Backend running on port ${port}`);
      console.log(`📡 Solana Network: ${this.config.solana.network}`);
      console.log(`🏢 Platform: ${this.config.platform.name}`);
      console.log(`🔗 Health check: http://localhost:${port}/health`);
    });
  }
}

// Start the application
const app = new App();
app.start();

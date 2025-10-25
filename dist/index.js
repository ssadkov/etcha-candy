"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const CollectionController_1 = require("./controllers/CollectionController");
const TicketController_1 = require("./controllers/TicketController");
const CollectionService_1 = require("./services/CollectionService");
const CandyMachineService_1 = require("./services/CandyMachineService");
const SolanaService_1 = require("./services/SolanaService");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.config = this.loadConfig();
        this.setupMiddleware();
        this.setupServices();
        this.setupRoutes();
    }
    loadConfig() {
        const configPath = path_1.default.join(process.cwd(), 'config', 'platform.json');
        if (!fs_1.default.existsSync(configPath)) {
            throw new Error('Platform configuration file not found. Please create config/platform.json');
        }
        const configData = fs_1.default.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: this.config.server.corsOrigin,
            credentials: true,
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: this.config.server.rateLimit.windowMs,
            max: this.config.server.rateLimit.max,
            message: 'Too many requests from this IP, please try again later.',
        });
        this.app.use('/api/', limiter);
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }
    setupServices() {
        try {
            const solanaService = new SolanaService_1.SolanaService(this.config);
            const collectionService = new CollectionService_1.CollectionService();
            const candyMachineService = new CandyMachineService_1.CandyMachineService(solanaService, collectionService);
            const collectionController = new CollectionController_1.CollectionController(collectionService, candyMachineService);
            const ticketController = new TicketController_1.TicketController(candyMachineService, collectionService, solanaService);
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
        }
        catch (error) {
            console.error('Failed to initialize services:', error);
            process.exit(1);
        }
    }
    setupRoutes() {
        const { collectionController, ticketController } = this.app.locals.controllers;
        this.app.use('/api', (0, routes_1.createRoutes)(collectionController, ticketController));
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
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Route not found',
            });
        });
        this.app.use((error, req, res, next) => {
            console.error('Unhandled error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        });
    }
    start() {
        const port = process.env.PORT || this.config.server.port;
        this.app.listen(port, () => {
            console.log(`🚀 Etcha Candy Backend running on port ${port}`);
            console.log(`📡 Solana Network: ${this.config.solana.network}`);
            console.log(`🏢 Platform: ${this.config.platform.name}`);
            console.log(`🔗 Health check: http://localhost:${port}/health`);
        });
    }
}
const app = new App();
app.start();
//# sourceMappingURL=index.js.map
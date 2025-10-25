"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const joi_1 = __importDefault(require("joi"));
class CollectionController {
    constructor(collectionService, candyMachineService) {
        this.validateCreateCollection = joi_1.default.object({
            eventCreator: joi_1.default.string().required(),
            eventCreatorName: joi_1.default.string().required(),
            name: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            eventName: joi_1.default.string().required(),
            eventDate: joi_1.default.string().required(),
            eventLocation: joi_1.default.string().required(),
            ticketPrice: joi_1.default.number().positive().required(),
            maxTickets: joi_1.default.number().integer().positive().required(),
            imageUrl: joi_1.default.string().uri().required(),
        });
        this.collectionService = collectionService;
        this.candyMachineService = candyMachineService;
    }
    async createCollection(req, res) {
        try {
            const { error, value } = this.validateCreateCollection.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: error.details[0].message,
                });
                return;
            }
            const collection = await this.collectionService.createCollection(value);
            res.status(201).json({
                success: true,
                data: collection,
                message: 'Collection created successfully',
            });
        }
        catch (error) {
            console.error('Error creating collection:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create collection',
            });
        }
    }
    async getCollections(req, res) {
        try {
            const collections = await this.collectionService.getCollections();
            res.json({
                success: true,
                data: collections,
            });
        }
        catch (error) {
            console.error('Error getting collections:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get collections',
            });
        }
    }
    async getCollectionById(req, res) {
        try {
            const { id } = req.params;
            const collection = await this.collectionService.getCollectionById(id);
            if (!collection) {
                res.status(404).json({
                    success: false,
                    error: 'Collection not found',
                });
                return;
            }
            res.json({
                success: true,
                data: collection,
            });
        }
        catch (error) {
            console.error('Error getting collection:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get collection',
            });
        }
    }
    async updateCollection(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const collection = await this.collectionService.updateCollection(id, updates);
            if (!collection) {
                res.status(404).json({
                    success: false,
                    error: 'Collection not found',
                });
                return;
            }
            res.json({
                success: true,
                data: collection,
                message: 'Collection updated successfully',
            });
        }
        catch (error) {
            console.error('Error updating collection:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update collection',
            });
        }
    }
    async deleteCollection(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.collectionService.deleteCollection(id);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Collection not found',
                });
                return;
            }
            res.json({
                success: true,
                message: 'Collection deleted successfully',
            });
        }
        catch (error) {
            console.error('Error deleting collection:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete collection',
            });
        }
    }
    async createCandyMachine(req, res) {
        try {
            const { id } = req.params;
            const collection = await this.collectionService.getCollectionById(id);
            if (!collection) {
                res.status(404).json({
                    success: false,
                    error: 'Collection not found',
                });
                return;
            }
            if (collection.candyMachineAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Candy Machine already exists for this collection',
                });
                return;
            }
            const candyMachineAddress = await this.candyMachineService.createCandyMachine(collection);
            await this.collectionService.updateCollection(id, {
                candyMachineAddress,
            });
            res.json({
                success: true,
                data: {
                    candyMachineAddress,
                },
                message: 'Candy Machine created successfully',
            });
        }
        catch (error) {
            console.error('Error creating Candy Machine:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create Candy Machine',
            });
        }
    }
    async getCandyMachineInfo(req, res) {
        try {
            const { id } = req.params;
            const collection = await this.collectionService.getCollectionById(id);
            if (!collection || !collection.candyMachineAddress) {
                res.status(404).json({
                    success: false,
                    error: 'Candy Machine not found',
                });
                return;
            }
            const info = await this.candyMachineService.getCandyMachineInfo(collection.candyMachineAddress);
            res.json({
                success: true,
                data: info,
            });
        }
        catch (error) {
            console.error('Error getting Candy Machine info:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get Candy Machine info',
            });
        }
    }
}
exports.CollectionController = CollectionController;
//# sourceMappingURL=CollectionController.js.map
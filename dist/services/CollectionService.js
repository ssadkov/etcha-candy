"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CollectionService {
    constructor() {
        this.collectionsPath = path_1.default.join(process.cwd(), 'data', 'collections.json');
        this.ensureDataFile();
    }
    ensureDataFile() {
        const dataDir = path_1.default.dirname(this.collectionsPath);
        if (!fs_1.default.existsSync(dataDir)) {
            fs_1.default.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(this.collectionsPath)) {
            fs_1.default.writeFileSync(this.collectionsPath, JSON.stringify({ collections: [] }, null, 2));
        }
    }
    readCollections() {
        try {
            const data = fs_1.default.readFileSync(this.collectionsPath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading collections:', error);
            return { collections: [] };
        }
    }
    writeCollections(collections) {
        try {
            fs_1.default.writeFileSync(this.collectionsPath, JSON.stringify({ collections }, null, 2));
        }
        catch (error) {
            console.error('Error writing collections:', error);
            throw new Error('Failed to save collections');
        }
    }
    async createCollection(data, candyMachineService) {
        const collections = this.readCollections();
        const collection = {
            id: this.generateId(),
            ...data,
            candyMachineAddress: undefined,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        try {
            console.log('Creating Collection NFT for:', collection.name);
            const collectionNftAddress = await candyMachineService.createCollectionNFT(collection);
            collection.collectionNftAddress = collectionNftAddress;
            console.log('Collection NFT created successfully:', collectionNftAddress);
        }
        catch (error) {
            console.error('Failed to create Collection NFT:', error);
        }
        collections.collections.push(collection);
        this.writeCollections(collections.collections);
        return collection;
    }
    async getCollections() {
        const collections = this.readCollections();
        return collections.collections;
    }
    async getCollectionById(id) {
        const collections = this.readCollections();
        return collections.collections.find(c => c.id === id) || null;
    }
    async updateCollection(id, updates) {
        const collections = this.readCollections();
        const index = collections.collections.findIndex(c => c.id === id);
        if (index === -1) {
            return null;
        }
        collections.collections[index] = {
            ...collections.collections[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        this.writeCollections(collections.collections);
        return collections.collections[index];
    }
    async deleteCollection(id) {
        const collections = this.readCollections();
        const initialLength = collections.collections.length;
        collections.collections = collections.collections.filter(c => c.id !== id);
        if (collections.collections.length < initialLength) {
            this.writeCollections(collections.collections);
            return true;
        }
        return false;
    }
    generateId() {
        return `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.CollectionService = CollectionService;
//# sourceMappingURL=CollectionService.js.map
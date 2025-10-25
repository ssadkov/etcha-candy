"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const joi_1 = __importDefault(require("joi"));
class TicketController {
    constructor(candyMachineService, collectionService, solanaService) {
        this.validateMintTicket = joi_1.default.object({
            collectionId: joi_1.default.string().required(),
            userWallet: joi_1.default.string().required(),
            quantity: joi_1.default.number().integer().min(1).max(10).default(1),
        });
        this.validateValidateTicket = joi_1.default.object({
            mintAddress: joi_1.default.string().required(),
            collectionId: joi_1.default.string().required(),
        });
        this.candyMachineService = candyMachineService;
        this.collectionService = collectionService;
        this.solanaService = solanaService;
    }
    async mintTicket(req, res) {
        try {
            const { error, value } = this.validateMintTicket.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: error.details[0].message,
                });
                return;
            }
            const { collectionId, userWallet, quantity } = value;
            const isValidWallet = await this.solanaService.isWalletValid(userWallet);
            if (!isValidWallet) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid wallet address',
                });
                return;
            }
            const collection = await this.collectionService.getCollectionById(collectionId);
            if (!collection) {
                res.status(404).json({
                    success: false,
                    error: 'Collection not found',
                });
                return;
            }
            if (!collection.candyMachineAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Candy Machine not created for this collection',
                });
                return;
            }
            const mintedNfts = await this.candyMachineService.mintTicket(collectionId, userWallet, quantity);
            res.json({
                success: true,
                data: {
                    mintedNfts,
                    collectionId,
                    userWallet,
                    quantity,
                },
                message: `${quantity} ticket(s) minted successfully`,
            });
        }
        catch (error) {
            console.error('Error minting ticket:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to mint ticket',
            });
        }
    }
    async getUserTickets(req, res) {
        try {
            const { wallet } = req.params;
            const isValidWallet = await this.solanaService.isWalletValid(wallet);
            if (!isValidWallet) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid wallet address',
                });
                return;
            }
            const collections = await this.collectionService.getCollections();
            const userTickets = collections.map(collection => ({
                collectionId: collection.id,
                collectionName: collection.name,
                eventName: collection.eventName,
                eventDate: collection.eventDate,
                eventLocation: collection.eventLocation,
                imageUrl: collection.imageUrl,
                candyMachineAddress: collection.candyMachineAddress,
                ownedTickets: [],
            }));
            res.json({
                success: true,
                data: {
                    wallet,
                    tickets: userTickets,
                },
            });
        }
        catch (error) {
            console.error('Error getting user tickets:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user tickets',
            });
        }
    }
    async validateTicket(req, res) {
        try {
            const { error, value } = this.validateValidateTicket.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: error.details[0].message,
                });
                return;
            }
            const { mintAddress, collectionId } = value;
            const isValidMint = await this.solanaService.isWalletValid(mintAddress);
            if (!isValidMint) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid mint address',
                });
                return;
            }
            const collection = await this.collectionService.getCollectionById(collectionId);
            if (!collection) {
                res.status(404).json({
                    success: false,
                    error: 'Collection not found',
                });
                return;
            }
            const isValid = true;
            const owner = 'mock_owner_address';
            res.json({
                success: true,
                data: {
                    mintAddress,
                    collectionId,
                    isValid,
                    owner,
                    collection: {
                        name: collection.name,
                        eventName: collection.eventName,
                        eventDate: collection.eventDate,
                        eventLocation: collection.eventLocation,
                    },
                },
                message: isValid ? 'Ticket is valid' : 'Ticket is invalid',
            });
        }
        catch (error) {
            console.error('Error validating ticket:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to validate ticket',
            });
        }
    }
}
exports.TicketController = TicketController;
//# sourceMappingURL=TicketController.js.map
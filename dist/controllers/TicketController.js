"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
            if (!collection.collectionNftAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Collection NFT not created',
                });
                return;
            }
            const userBalance = await this.solanaService.getConnection().getBalance(new (await Promise.resolve().then(() => __importStar(require('@solana/web3.js')))).PublicKey(userWallet));
            const userBalanceSOL = userBalance / 1e9;
            const requiredSOL = collection.ticketPrice * (quantity || 1);
            if (userBalanceSOL < requiredSOL) {
                res.status(400).json({
                    success: false,
                    error: `Insufficient SOL balance. Required: ${requiredSOL} SOL, Available: ${userBalanceSOL} SOL`,
                });
                return;
            }
            const mintResult = await this.candyMachineService.mintTicket(collectionId, userWallet, quantity);
            const response = {
                success: true,
                ticketNftAddresses: mintResult.nftAddresses,
                transactionSignature: 'mock_transaction_signature',
                ticketNumbers: mintResult.ticketNumbers,
            };
            res.json({
                success: true,
                data: response,
                message: `${quantity} ticket(s) minted successfully`,
            });
        }
        catch (error) {
            console.error('Error minting ticket:', error);
            res.status(500).json({
                success: false,
                error: `Failed to mint ticket: ${error.message}`,
            });
        }
    }
    async getUserTickets(req, res) {
        try {
            const { wallet } = req.params;
            const { collectionId } = req.query;
            const isValidWallet = await this.solanaService.isWalletValid(wallet);
            if (!isValidWallet) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid wallet address',
                });
                return;
            }
            const userTickets = await this.candyMachineService.getUserTickets(wallet, collectionId);
            res.json({
                success: true,
                data: {
                    wallet,
                    tickets: userTickets,
                    count: userTickets.length,
                    platformWallet: this.solanaService.getWalletAddress(),
                    filteredByPlatform: true,
                },
                message: `Found ${userTickets.length} ticket(s) from our platform`,
            });
        }
        catch (error) {
            console.error('Error getting user tickets:', error);
            res.status(500).json({
                success: false,
                error: `Failed to get user tickets: ${error.message}`,
            });
        }
    }
    async getUserTicketsFromPlatform(req, res) {
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
            const userTickets = await this.candyMachineService.getUserTicketsFromPlatform(wallet);
            res.json({
                success: true,
                data: {
                    wallet,
                    tickets: userTickets,
                    count: userTickets.length,
                    platformWallet: this.solanaService.getWalletAddress(),
                    filteredByPlatform: true,
                },
                message: `Found ${userTickets.length} ticket(s) from our platform`,
            });
        }
        catch (error) {
            console.error('Error getting user tickets from platform:', error);
            res.status(500).json({
                success: false,
                error: `Failed to get user tickets from platform: ${error.message}`,
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
            const isValid = await this.candyMachineService.validateTicket(mintAddress, collectionId);
            res.json({
                success: true,
                data: {
                    mintAddress,
                    collectionId,
                    isValid,
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
                error: `Failed to validate ticket: ${error.message}`,
            });
        }
    }
    async getTestWallets(req, res) {
        try {
            const testWallets = await this.candyMachineService.getTestWallets();
            res.json({
                success: true,
                data: {
                    wallets: testWallets,
                    count: testWallets.length,
                },
                message: `Found ${testWallets.length} test wallet(s)`,
            });
        }
        catch (error) {
            console.error('Error getting test wallets:', error);
            res.status(500).json({
                success: false,
                error: `Failed to get test wallets: ${error.message}`,
            });
        }
    }
    async addItemsToCandyMachine(req, res) {
        try {
            const { collectionId } = req.body;
            if (!collectionId) {
                res.status(400).json({
                    success: false,
                    error: 'Collection ID is required',
                });
                return;
            }
            console.log('🎫 Adding items to Candy Machine for collection:', collectionId);
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
                    error: 'Candy Machine not found for this collection',
                });
                return;
            }
            await this.candyMachineService.addItemsToCandyMachine(collection.candyMachineAddress, collection);
            res.json({
                success: true,
                data: {
                    message: 'Items added to Candy Machine successfully',
                    collectionId,
                    candyMachineAddress: collection.candyMachineAddress,
                    itemsCount: collection.maxTickets,
                },
            });
        }
        catch (error) {
            console.error('Error adding items to Candy Machine:', error);
            res.status(500).json({
                success: false,
                error: `Failed to add items to Candy Machine: ${error.message}`,
            });
        }
    }
    async createMarketplace(req, res) {
        try {
            const auctionHouseAddress = await this.candyMachineService.createMarketplace();
            res.json({
                success: true,
                data: {
                    auctionHouseAddress,
                },
                message: 'Marketplace created successfully',
            });
        }
        catch (error) {
            console.error('Error creating marketplace:', error);
            res.status(500).json({
                success: false,
                error: `Failed to create marketplace: ${error.message}`,
            });
        }
    }
    async listTicketForSale(req, res) {
        try {
            const { nftMintAddress, priceInSol, userWallet, auctionHouseAddress } = req.body;
            if (!nftMintAddress || !priceInSol || !userWallet || !auctionHouseAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                });
                return;
            }
            const result = await this.candyMachineService.listTicketForSale(auctionHouseAddress, nftMintAddress, priceInSol, userWallet);
            res.json({
                success: true,
                data: result,
                message: 'Ticket listed successfully',
            });
        }
        catch (error) {
            console.error('Error listing ticket:', error);
            res.status(500).json({
                success: false,
                error: `Failed to list ticket: ${error.message}`,
            });
        }
    }
    async buyTicketFromMarketplace(req, res) {
        try {
            const { listingAddress, userWallet, auctionHouseAddress } = req.body;
            if (!listingAddress || !userWallet || !auctionHouseAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                });
                return;
            }
            const result = await this.candyMachineService.buyTicketFromMarketplace(auctionHouseAddress, listingAddress, userWallet);
            res.json({
                success: true,
                data: result,
                message: 'Ticket purchased successfully',
            });
        }
        catch (error) {
            console.error('Error buying ticket:', error);
            res.status(500).json({
                success: false,
                error: `Failed to buy ticket: ${error.message}`,
            });
        }
    }
    async getActiveListings(req, res) {
        try {
            const { auctionHouseAddress } = req.params;
            if (!auctionHouseAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Auction House address is required',
                });
                return;
            }
            const listings = await this.candyMachineService.getActiveListings(auctionHouseAddress);
            res.json({
                success: true,
                data: {
                    listings,
                    count: listings.length,
                },
                message: `Found ${listings.length} active listing(s)`,
            });
        }
        catch (error) {
            console.error('Error getting listings:', error);
            res.status(500).json({
                success: false,
                error: `Failed to get listings: ${error.message}`,
            });
        }
    }
}
exports.TicketController = TicketController;
//# sourceMappingURL=TicketController.js.map
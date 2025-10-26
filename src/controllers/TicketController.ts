import { Request, Response } from 'express';
import { CandyMachineService } from '../services/CandyMachineService';
import { CollectionService } from '../services/CollectionService';
import { SolanaService } from '../services/SolanaService';
import { 
  MintTicketRequest, 
  ValidateTicketRequest, 
  ApiResponse, 
  MintTicketResponse,
  ListTicketRequest,
  BuyTicketRequest
} from '../types';
import Joi from 'joi';

export class TicketController {
  private candyMachineService: CandyMachineService;
  private collectionService: CollectionService;
  private solanaService: SolanaService;

  constructor(
    candyMachineService: CandyMachineService,
    collectionService: CollectionService,
    solanaService: SolanaService
  ) {
    this.candyMachineService = candyMachineService;
    this.collectionService = collectionService;
    this.solanaService = solanaService;
  }

  private validateMintTicket = Joi.object({
    collectionId: Joi.string().required(),
    userWallet: Joi.string().required(),
    quantity: Joi.number().integer().min(1).max(10).default(1),
  });

  private validateValidateTicket = Joi.object({
    mintAddress: Joi.string().required(),
    collectionId: Joi.string().required(),
  });

  async mintTicket(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = this.validateMintTicket.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        } as ApiResponse);
        return;
      }

      const { collectionId, userWallet, quantity } = value as MintTicketRequest;

      // Validate wallet address
      const isValidWallet = await this.solanaService.isWalletValid(userWallet);
      if (!isValidWallet) {
        res.status(400).json({
          success: false,
          error: 'Invalid wallet address',
        } as ApiResponse);
        return;
      }

      // Check if collection exists
      const collection = await this.collectionService.getCollectionById(collectionId);
      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      if (!collection.collectionNftAddress) {
        res.status(400).json({
          success: false,
          error: 'Collection NFT not created',
        } as ApiResponse);
        return;
      }

      // Check if user has enough SOL
      const userBalance = await this.solanaService.getConnection().getBalance(
        new (await import('@solana/web3.js')).PublicKey(userWallet)
      );
      const userBalanceSOL = userBalance / 1e9;
      const requiredSOL = collection.ticketPrice * (quantity || 1);

      if (userBalanceSOL < requiredSOL) {
        res.status(400).json({
          success: false,
          error: `Insufficient SOL balance. Required: ${requiredSOL} SOL, Available: ${userBalanceSOL} SOL`,
        } as ApiResponse);
        return;
      }

      // Mint tickets (Candy Machine will be created if needed)
      const mintResult = await this.candyMachineService.mintTicket(collectionId, userWallet, quantity);
      
      const response: MintTicketResponse = {
        success: true,
        ticketNftAddresses: mintResult.nftAddresses,
        transactionSignature: 'mock_transaction_signature', // Will be real in production
        ticketNumbers: mintResult.ticketNumbers,
      };
      
      res.json({
        success: true,
        data: response,
        message: `${quantity} ticket(s) minted successfully`,
      } as ApiResponse);
    } catch (error) {
      console.error('Error minting ticket:', error);
      res.status(500).json({
        success: false,
        error: `Failed to mint ticket: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  async getUserTickets(req: Request, res: Response): Promise<void> {
    try {
      const { wallet } = req.params;
      const { collectionId } = req.query;
      
      // Validate wallet address
      const isValidWallet = await this.solanaService.isWalletValid(wallet);
      if (!isValidWallet) {
        res.status(400).json({
          success: false,
          error: 'Invalid wallet address',
        } as ApiResponse);
        return;
      }

      // Get user's NFTs from blockchain (filtered by our platform)
      const userTickets = await this.candyMachineService.getUserTickets(wallet, collectionId as string);

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
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting user tickets:', error);
      res.status(500).json({
        success: false,
        error: `Failed to get user tickets: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  async getUserTicketsFromPlatform(req: Request, res: Response): Promise<void> {
    try {
      const { wallet } = req.params;
      
      // Validate wallet address
      const isValidWallet = await this.solanaService.isWalletValid(wallet);
      if (!isValidWallet) {
        res.status(400).json({
          success: false,
          error: 'Invalid wallet address',
        } as ApiResponse);
        return;
      }

      // Get user's NFTs from our platform only
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
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting user tickets from platform:', error);
      res.status(500).json({
        success: false,
        error: `Failed to get user tickets from platform: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  async validateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = this.validateValidateTicket.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        } as ApiResponse);
        return;
      }

      const { mintAddress, collectionId } = value as ValidateTicketRequest;

      // Validate mint address
      const isValidMint = await this.solanaService.isWalletValid(mintAddress);
      if (!isValidMint) {
        res.status(400).json({
          success: false,
          error: 'Invalid mint address',
        } as ApiResponse);
        return;
      }

      // Get collection
      const collection = await this.collectionService.getCollectionById(collectionId);
      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      // Validate ticket on blockchain
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
      } as ApiResponse);
    } catch (error) {
      console.error('Error validating ticket:', error);
      res.status(500).json({
        success: false,
        error: `Failed to validate ticket: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  // New endpoint to get test wallets
  async getTestWallets(req: Request, res: Response): Promise<void> {
    try {
      const testWallets = await this.candyMachineService.getTestWallets();
      
      res.json({
        success: true,
        data: {
          wallets: testWallets,
          count: testWallets.length,
        },
        message: `Found ${testWallets.length} test wallet(s)`,
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting test wallets:', error);
      res.status(500).json({
        success: false,
        error: `Failed to get test wallets: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  // New endpoint to add items to Candy Machine
  async addItemsToCandyMachine(req: Request, res: Response): Promise<void> {
    try {
      const { collectionId } = req.body;

      if (!collectionId) {
        res.status(400).json({
          success: false,
          error: 'Collection ID is required',
        } as ApiResponse);
        return;
      }

      console.log('🎫 Adding items to Candy Machine for collection:', collectionId);

      // Get collection
      const collection = await this.collectionService.getCollectionById(collectionId);
      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      if (!collection.candyMachineAddress) {
        res.status(400).json({
          success: false,
          error: 'Candy Machine not found for this collection',
        } as ApiResponse);
        return;
      }

      // Add items to Candy Machine
      await this.candyMachineService.addItemsToCandyMachine(collection.candyMachineAddress, collection);

      res.json({
        success: true,
        data: {
          message: 'Items added to Candy Machine successfully',
          collectionId,
          candyMachineAddress: collection.candyMachineAddress,
          itemsCount: collection.maxTickets,
        },
      } as ApiResponse);
    } catch (error) {
      console.error('Error adding items to Candy Machine:', error);
      res.status(500).json({
        success: false,
        error: `Failed to add items to Candy Machine: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  // ==========================================
  // MARKETPLACE ENDPOINTS (Secondary Sales)
  // ==========================================

  /**
   * Create Auction House marketplace (one-time setup)
   */
  async createMarketplace(req: Request, res: Response): Promise<void> {
    try {
      const auctionHouseAddress = await this.candyMachineService.createMarketplace();
      
      res.json({
        success: true,
        data: {
          auctionHouseAddress,
        },
        message: 'Marketplace created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error creating marketplace:', error);
      res.status(500).json({
        success: false,
        error: `Failed to create marketplace: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  /**
   * List NFT for sale
   */
  async listTicketForSale(req: Request, res: Response): Promise<void> {
    try {
      const { nftMintAddress, priceInSol, userWallet, auctionHouseAddress } = req.body;

      if (!nftMintAddress || !priceInSol || !userWallet || !auctionHouseAddress) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
        } as ApiResponse);
        return;
      }

      const result = await this.candyMachineService.listTicketForSale(
        auctionHouseAddress,
        nftMintAddress,
        priceInSol,
        userWallet
      );

      res.json({
        success: true,
        data: result,
        message: 'Ticket listed successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error listing ticket:', error);
      res.status(500).json({
        success: false,
        error: `Failed to list ticket: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  /**
   * Buy NFT from marketplace
   */
  async buyTicketFromMarketplace(req: Request, res: Response): Promise<void> {
    try {
      const { listingAddress, userWallet, auctionHouseAddress } = req.body;

      if (!listingAddress || !userWallet || !auctionHouseAddress) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
        } as ApiResponse);
        return;
      }

      const result = await this.candyMachineService.buyTicketFromMarketplace(
        auctionHouseAddress,
        listingAddress,
        userWallet
      );

      res.json({
        success: true,
        data: result,
        message: 'Ticket purchased successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error buying ticket:', error);
      res.status(500).json({
        success: false,
        error: `Failed to buy ticket: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }

  /**
   * Get all active listings from marketplace
   */
  async getActiveListings(req: Request, res: Response): Promise<void> {
    try {
      const { auctionHouseAddress } = req.params;

      if (!auctionHouseAddress) {
        res.status(400).json({
          success: false,
          error: 'Auction House address is required',
        } as ApiResponse);
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
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting listings:', error);
      res.status(500).json({
        success: false,
        error: `Failed to get listings: ${(error as Error).message}`,
      } as ApiResponse);
    }
  }
}

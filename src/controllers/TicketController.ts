import { Request, Response } from 'express';
import { CandyMachineService } from '../services/CandyMachineService';
import { CollectionService } from '../services/CollectionService';
import { SolanaService } from '../services/SolanaService';
import { MintTicketRequest, ValidateTicketRequest, ApiResponse } from '../types';
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

      // Check if collection exists and has Candy Machine
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
          error: 'Candy Machine not created for this collection',
        } as ApiResponse);
        return;
      }

      // Mint tickets
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
      } as ApiResponse);
    } catch (error) {
      console.error('Error minting ticket:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mint ticket',
      } as ApiResponse);
    }
  }

  async getUserTickets(req: Request, res: Response): Promise<void> {
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

      // Get all collections
      const collections = await this.collectionService.getCollections();
      
      // For now, return collections where user could have tickets
      // In a real implementation, you would query the blockchain for actual NFT ownership
      const userTickets = collections.map(collection => ({
        collectionId: collection.id,
        collectionName: collection.name,
        eventName: collection.eventName,
        eventDate: collection.eventDate,
        eventLocation: collection.eventLocation,
        imageUrl: collection.imageUrl,
        candyMachineAddress: collection.candyMachineAddress,
        // Note: Actual ticket ownership would be determined by querying the blockchain
        ownedTickets: [], // This would be populated by blockchain queries
      }));

      res.json({
        success: true,
        data: {
          wallet,
          tickets: userTickets,
        },
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting user tickets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user tickets',
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

      // In a real implementation, you would:
      // 1. Query the blockchain to verify the NFT exists
      // 2. Check if it belongs to the correct collection
      // 3. Verify the current owner
      // 4. Check if the ticket hasn't been used before

      // For now, return a mock validation
      const isValid = true; // This would be determined by blockchain queries
      const owner = 'mock_owner_address'; // This would be the actual owner from blockchain

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
      } as ApiResponse);
    } catch (error) {
      console.error('Error validating ticket:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate ticket',
      } as ApiResponse);
    }
  }
}

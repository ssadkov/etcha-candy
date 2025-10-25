import { Request, Response } from 'express';
import { CollectionService } from '../services/CollectionService';
import { CandyMachineService } from '../services/CandyMachineService';
import { SolanaService } from '../services/SolanaService';
import { CreateCollectionRequest, ApiResponse } from '../types';
import Joi from 'joi';

export class CollectionController {
  private collectionService: CollectionService;
  private candyMachineService: CandyMachineService;

  constructor(collectionService: CollectionService, candyMachineService: CandyMachineService) {
    this.collectionService = collectionService;
    this.candyMachineService = candyMachineService;
  }

  private validateCreateCollection = Joi.object({
    eventCreator: Joi.string().required(),
    eventCreatorName: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    eventName: Joi.string().required(),
    eventDate: Joi.string().required(),
    eventLocation: Joi.string().required(),
    ticketPrice: Joi.number().positive().required(),
    maxTickets: Joi.number().integer().positive().required(),
    imageUrl: Joi.string().uri().required(),
  });

  async createCollection(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = this.validateCreateCollection.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        } as ApiResponse);
        return;
      }

      const collection = await this.collectionService.createCollection(value as CreateCollectionRequest, this.candyMachineService);
      
      res.status(201).json({
        success: true,
        data: collection,
        message: 'Collection created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create collection',
      } as ApiResponse);
    }
  }

  async getCollections(req: Request, res: Response): Promise<void> {
    try {
      const collections = await this.collectionService.getCollections();
      
      res.json({
        success: true,
        data: collections,
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting collections:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get collections',
      } as ApiResponse);
    }
  }

  async getCollectionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const collection = await this.collectionService.getCollectionById(id);
      
      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: collection,
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting collection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get collection',
      } as ApiResponse);
    }
  }

  async updateCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const collection = await this.collectionService.updateCollection(id, updates);
      
      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: collection,
        message: 'Collection updated successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error updating collection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update collection',
      } as ApiResponse);
    }
  }

  async deleteCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.collectionService.deleteCollection(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Collection deleted successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error deleting collection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete collection',
      } as ApiResponse);
    }
  }

  async createCandyMachine(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const collection = await this.collectionService.getCollectionById(id);
      
      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        } as ApiResponse);
        return;
      }

      if (collection.candyMachineAddress) {
        res.status(400).json({
          success: false,
          error: 'Candy Machine already exists for this collection',
        } as ApiResponse);
        return;
      }

      const candyMachineAddress = await this.candyMachineService.createCandyMachine(collection);
      
      // Update collection with Candy Machine address
      await this.collectionService.updateCollection(id, {
        candyMachineAddress,
      });

      res.json({
        success: true,
        data: {
          candyMachineAddress,
        },
        message: 'Candy Machine created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Error creating Candy Machine:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create Candy Machine',
      } as ApiResponse);
    }
  }

  async getCandyMachineInfo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const collection = await this.collectionService.getCollectionById(id);
      
      if (!collection || !collection.candyMachineAddress) {
        res.status(404).json({
          success: false,
          error: 'Candy Machine not found',
        } as ApiResponse);
        return;
      }

      const info = await this.candyMachineService.getCandyMachineInfo(collection.candyMachineAddress);
      
      res.json({
        success: true,
        data: info,
      } as ApiResponse);
    } catch (error) {
      console.error('Error getting Candy Machine info:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get Candy Machine info',
      } as ApiResponse);
    }
  }
}

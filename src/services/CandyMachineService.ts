import { PublicKey } from '@solana/web3.js';
import { Collection } from '../types';
import { SolanaService } from './SolanaService';
import { CollectionService } from './CollectionService';

export class CandyMachineService {
  private solanaService: SolanaService;
  private collectionService: CollectionService;

  constructor(solanaService: SolanaService, collectionService: CollectionService) {
    this.solanaService = solanaService;
    this.collectionService = collectionService;
  }

  async createCollectionNFT(collection: Collection): Promise<string> {
    try {
      console.log('🎨 Starting Collection NFT creation...');
      console.log('Collection data:', {
        name: collection.name,
        eventCreator: collection.eventCreator,
        wallet: this.solanaService.getWalletAddress()
      });

      const metaplex = this.solanaService.getMetaplex();
      
      // Check wallet balance first
      const balance = await this.solanaService.getBalance();
      console.log('💰 Wallet balance:', balance, 'SOL');
      
      if (balance < 0.01) {
        throw new Error('Insufficient SOL balance for transaction');
      }
      
      console.log('🎨 Creating Collection NFT with URI metadata...');
      
      // Create metadata URI (our API endpoint)
      const metadataUri = `https://api.etcha-candy.com/metadata/${collection.id}`;
      
      // Create Collection NFT with URI metadata (no upload to Bundlr)
      const collectionNft = await metaplex.nfts().create({
        name: collection.name,
        symbol: collection.name.substring(0, 4).toUpperCase(),
        uri: metadataUri, // Our API endpoint for metadata
        sellerFeeBasisPoints: 250, // 2.5% royalty
        creators: [
          {
            address: this.solanaService.getKeypair().publicKey,
            share: 100, // 100% to platform
          }
        ],
        isCollection: true,
      });

      console.log('🎉 Collection NFT created successfully!');
      console.log('NFT Address:', collectionNft.nft.address.toString());
      console.log('NFT Symbol:', collectionNft.nft.symbol);
      console.log('Metadata URI:', metadataUri);
      
      return collectionNft.nft.address.toString();
    } catch (error) {
      console.error('❌ Error creating Collection NFT:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw new Error(`Failed to create Collection NFT: ${(error as Error).message}`);
    }
  }

  async createCandyMachine(collection: Collection): Promise<string> {
    try {
      // For now, return a mock Candy Machine address
      // In a real implementation, this would create an actual Candy Machine
      const mockAddress = `CM_${collection.id}_${Date.now()}`;
      
      console.log(`Mock Candy Machine created for collection ${collection.id}: ${mockAddress}`);
      
      return mockAddress;
    } catch (error) {
      console.error('Error creating Candy Machine:', error);
      throw new Error(`Failed to create Candy Machine: ${(error as Error).message}`);
    }
  }

  async mintTicket(collectionId: string, userWallet: string, quantity: number = 1): Promise<string[]> {
    try {
      const collection = await this.getCollectionById(collectionId);
      
      if (!collection || !collection.candyMachineAddress) {
        throw new Error('Collection or Candy Machine not found');
      }

      // For now, return mock minted NFT addresses
      // In a real implementation, this would mint actual NFTs
      const mintedNfts: string[] = [];

      for (let i = 0; i < quantity; i++) {
        const mockNftAddress = `NFT_${collectionId}_${userWallet}_${Date.now()}_${i}`;
        mintedNfts.push(mockNftAddress);
        console.log(`Mock ticket minted: ${mockNftAddress}`);
      }

      return mintedNfts;
    } catch (error) {
      console.error('Error minting ticket:', error);
      throw new Error(`Failed to mint ticket: ${(error as Error).message}`);
    }
  }

  async getCandyMachineInfo(candyMachineAddress: string): Promise<any> {
    try {
      // For now, return mock Candy Machine info
      // In a real implementation, this would query the actual Candy Machine
      return {
        address: candyMachineAddress,
        itemsMinted: Math.floor(Math.random() * 100),
        itemsAvailable: 1000,
        price: 0.1,
        isFullyLoaded: true,
        isActive: true,
      };
    } catch (error) {
      console.error('Error getting Candy Machine info:', error);
      throw new Error(`Failed to get Candy Machine info: ${(error as Error).message}`);
    }
  }

  private async getCollectionById(collectionId: string): Promise<Collection | null> {
    return await this.collectionService.getCollectionById(collectionId);
  }
}
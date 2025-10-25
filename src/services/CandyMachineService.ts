import { PublicKey, Keypair } from '@solana/web3.js';
import { Collection, CandyMachineConfig, TestWallet } from '../types';
import { SolanaService } from './SolanaService';
import { CollectionService } from './CollectionService';
import fs from 'fs';
import path from 'path';

export class CandyMachineService {
  private solanaService: SolanaService;
  private collectionService: CollectionService;
  private testWallets: TestWallet[];

  constructor(solanaService: SolanaService, collectionService: CollectionService) {
    this.solanaService = solanaService;
    this.collectionService = collectionService;
    this.testWallets = this.loadTestWallets();
  }

  private loadTestWallets(): TestWallet[] {
    try {
      const walletsPath = path.join(process.cwd(), 'data', 'test-wallets.json');
      const data = fs.readFileSync(walletsPath, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.testWallets || [];
    } catch (error) {
      console.error('Error loading test wallets:', error);
      return [];
    }
  }

  private getTestWallet(walletAddress: string): TestWallet | null {
    return this.testWallets.find(w => w.wallet === walletAddress) || null;
  }

  private createKeypairFromPrivateKey(privateKey: number[]): Keypair {
    return Keypair.fromSecretKey(new Uint8Array(privateKey));
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
      console.log('🍭 Creating Candy Machine for collection:', collection.name);
      
      if (!collection.collectionNftAddress) {
        throw new Error('Collection NFT must be created before Candy Machine');
      }

      const metaplex = this.solanaService.getMetaplex();
      
      // Check wallet balance
      const balance = await this.solanaService.getBalance();
      console.log('💰 Platform wallet balance:', balance, 'SOL');
      
      if (balance < 0.1) {
        throw new Error('Insufficient SOL balance for Candy Machine creation');
      }

      // Create Candy Machine configuration
      const candyMachineConfig = {
        price: collection.ticketPrice,
        number: collection.maxTickets,
        sellerFeeBasisPoints: 250, // 2.5% royalty
        symbol: collection.name.substring(0, 4).toUpperCase(),
        creators: [
          {
            address: this.solanaService.getKeypair().publicKey,
            share: 100,
          }
        ],
        collection: {
          address: new PublicKey(collection.collectionNftAddress),
          updateAuthority: this.solanaService.getKeypair(),
        },
        // Use URI-based metadata for each ticket
        uri: `https://api.etcha-candy.com/ticket-metadata/${collection.id}`,
      };

      console.log('🍭 Creating Candy Machine with config:', {
        price: candyMachineConfig.price,
        number: candyMachineConfig.number,
        collection: collection.collectionNftAddress
      });

      // Create Candy Machine
      const candyMachine = await metaplex.candyMachines().create({
        ...candyMachineConfig,
        // Generate items on-the-fly
        items: Array.from({ length: collection.maxTickets }, (_, i) => ({
          name: `${collection.eventName} Ticket #${String(i + 1).padStart(3, '0')}`,
          uri: `https://api.etcha-candy.com/ticket-metadata/${collection.id}/${i + 1}`,
        })),
      });

      console.log('🎉 Candy Machine created successfully!');
      console.log('Candy Machine Address:', candyMachine.address.toString());
      
      return candyMachine.address.toString();
    } catch (error) {
      console.error('❌ Error creating Candy Machine:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw new Error(`Failed to create Candy Machine: ${(error as Error).message}`);
    }
  }

  async mintTicket(collectionId: string, userWallet: string, quantity: number = 1): Promise<{nftAddresses: string[], ticketNumbers: string[]}> {
    try {
      console.log('🎫 Starting ticket minting...');
      console.log('Collection ID:', collectionId);
      console.log('User Wallet:', userWallet);
      console.log('Quantity:', quantity);

      const collection = await this.getCollectionById(collectionId);
      
      if (!collection) {
        throw new Error('Collection not found');
      }

      // Check if Candy Machine exists, create if not (lazy loading)
      if (!collection.candyMachineAddress) {
        console.log('🍭 Candy Machine not found, creating...');
        const candyMachineAddress = await this.createCandyMachine(collection);
        
        // Update collection with Candy Machine address
        await this.collectionService.updateCollection(collectionId, {
          candyMachineAddress,
          candyMachineConfig: {
            price: collection.ticketPrice,
            supply: collection.maxTickets,
            minted: 0,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        });
        
        // Reload collection with updated data
        const updatedCollection = await this.getCollectionById(collectionId);
        if (!updatedCollection) {
          throw new Error('Failed to update collection with Candy Machine');
        }
        collection.candyMachineAddress = candyMachineAddress;
      }

      // Get test wallet for minting
      const testWallet = this.getTestWallet(userWallet);
      if (!testWallet) {
        throw new Error('Test wallet not found');
      }

      const userKeypair = this.createKeypairFromPrivateKey(testWallet.privateKey);
      const metaplex = this.solanaService.getMetaplex();

      // Check user wallet balance
      const userBalance = await this.solanaService.getConnection().getBalance(userKeypair.publicKey);
      const userBalanceSOL = userBalance / 1e9;
      console.log('💰 User wallet balance:', userBalanceSOL, 'SOL');

      if (userBalanceSOL < collection.ticketPrice * quantity) {
        throw new Error(`Insufficient SOL balance. Required: ${collection.ticketPrice * quantity} SOL, Available: ${userBalanceSOL} SOL`);
      }

      const mintedNfts: string[] = [];
      const ticketNumbers: string[] = [];

      // Mint tickets one by one
      for (let i = 0; i < quantity; i++) {
        console.log(`🎫 Minting ticket ${i + 1}/${quantity}...`);
        
        const candyMachine = await metaplex.candyMachines().findByAddress({
          address: new PublicKey(collection.candyMachineAddress!),
        });

        // Mint NFT
        const mintResult = await metaplex.candyMachines().mint({
          candyMachine,
          collectionUpdateAuthority: this.solanaService.getKeypair(),
        });

        const nftAddress = mintResult.nft.address.toString();
        const ticketNumber = String(collection.candyMachineConfig?.minted || 0 + i + 1).padStart(3, '0');
        
        mintedNfts.push(nftAddress);
        ticketNumbers.push(ticketNumber);
        
        console.log(`✅ Ticket ${ticketNumber} minted: ${nftAddress}`);
      }

      // Update minted count
      const currentMinted = collection.candyMachineConfig?.minted || 0;
      await this.collectionService.updateCollection(collectionId, {
        candyMachineConfig: {
          ...collection.candyMachineConfig!,
          minted: currentMinted + quantity
        }
      });

      console.log('🎉 All tickets minted successfully!');
      console.log('Minted NFTs:', mintedNfts);
      console.log('Ticket Numbers:', ticketNumbers);

      return { nftAddresses: mintedNfts, ticketNumbers };
    } catch (error) {
      console.error('❌ Error minting ticket:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw new Error(`Failed to mint ticket: ${(error as Error).message}`);
    }
  }

  async getCandyMachineInfo(candyMachineAddress: string): Promise<any> {
    try {
      const metaplex = this.solanaService.getMetaplex();
      
      const candyMachine = await metaplex.candyMachines().findByAddress({
        address: new PublicKey(candyMachineAddress),
      });

      return {
        address: candyMachineAddress,
        itemsMinted: candyMachine.itemsMinted,
        itemsAvailable: candyMachine.itemsAvailable,
        price: candyMachine.price?.basisPoints ? candyMachine.price.basisPoints / 1e9 : 0,
        isFullyLoaded: candyMachine.isFullyLoaded,
        isActive: candyMachine.isActive,
        symbol: candyMachine.symbol,
        sellerFeeBasisPoints: candyMachine.sellerFeeBasisPoints,
      };
    } catch (error) {
      console.error('Error getting Candy Machine info:', error);
      throw new Error(`Failed to get Candy Machine info: ${(error as Error).message}`);
    }
  }

  async getTestWallets(): Promise<TestWallet[]> {
    return this.testWallets;
  }

  async getUserTickets(userWallet: string): Promise<string[]> {
    try {
      const testWallet = this.getTestWallet(userWallet);
      if (!testWallet) {
        throw new Error('Test wallet not found');
      }

      const userKeypair = this.createKeypairFromPrivateKey(testWallet.privateKey);
      const metaplex = this.solanaService.getMetaplex();

      // Get all NFTs owned by the user
      const nfts = await metaplex.nfts().findAllByOwner({
        owner: userKeypair.publicKey,
      });

      return nfts.map(nft => nft.address.toString());
    } catch (error) {
      console.error('Error getting user tickets:', error);
      throw new Error(`Failed to get user tickets: ${(error as Error).message}`);
    }
  }

  async validateTicket(nftAddress: string, collectionId: string): Promise<boolean> {
    try {
      const metaplex = this.solanaService.getMetaplex();
      
      const nft = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(nftAddress),
      });

      // Check if NFT exists and has valid metadata
      if (!nft) {
        return false;
      }

      // Additional validation can be added here
      // For now, just check if NFT exists
      return true;
    } catch (error) {
      console.error('Error validating ticket:', error);
      return false;
    }
  }

  private async getCollectionById(collectionId: string): Promise<Collection | null> {
    return await this.collectionService.getCollectionById(collectionId);
  }
}
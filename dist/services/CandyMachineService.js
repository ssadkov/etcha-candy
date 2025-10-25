"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachineService = void 0;
const web3_js_1 = require("@solana/web3.js");
class CandyMachineService {
    constructor(solanaService, collectionService) {
        this.solanaService = solanaService;
        this.collectionService = collectionService;
    }
    async createCollectionNFT(collection) {
        try {
            const metaplex = this.solanaService.getMetaplex();
            const metadata = {
                name: collection.name,
                description: collection.description,
                image: collection.imageUrl,
                attributes: [
                    { trait_type: 'Event', value: collection.eventName },
                    { trait_type: 'Organizer', value: collection.eventCreatorName },
                    { trait_type: 'Date', value: collection.eventDate },
                    { trait_type: 'Location', value: collection.eventLocation },
                    { trait_type: 'Type', value: 'Collection' },
                    { trait_type: 'Max Tickets', value: collection.maxTickets.toString() },
                    { trait_type: 'Ticket Price', value: `${collection.ticketPrice} SOL` }
                ],
                properties: {
                    creators: [
                        {
                            address: this.solanaService.getWalletAddress(),
                            verified: true,
                            share: 50,
                        },
                        {
                            address: collection.eventCreator,
                            verified: false,
                            share: 50,
                        },
                    ],
                },
            };
            const { uri } = await metaplex.nfts().uploadMetadata(metadata);
            console.log('Metadata uploaded to:', uri);
            const collectionNft = await metaplex.nfts().create({
                name: collection.name,
                symbol: collection.name.substring(0, 4).toUpperCase(),
                uri: uri,
                sellerFeeBasisPoints: 250,
                creators: [
                    {
                        address: this.solanaService.getKeypair().publicKey,
                        share: 50,
                    },
                    {
                        address: new web3_js_1.PublicKey(collection.eventCreator),
                        share: 50,
                    },
                ],
                isCollection: true,
            });
            console.log('Collection NFT created:', collectionNft.nft.address.toString());
            console.log('Collection NFT metadata:', collectionNft.nft.uri);
            return collectionNft.nft.address.toString();
        }
        catch (error) {
            console.error('Error creating Collection NFT:', error);
            throw new Error(`Failed to create Collection NFT: ${error.message}`);
        }
    }
    async createCandyMachine(collection) {
        try {
            const mockAddress = `CM_${collection.id}_${Date.now()}`;
            console.log(`Mock Candy Machine created for collection ${collection.id}: ${mockAddress}`);
            return mockAddress;
        }
        catch (error) {
            console.error('Error creating Candy Machine:', error);
            throw new Error(`Failed to create Candy Machine: ${error.message}`);
        }
    }
    async mintTicket(collectionId, userWallet, quantity = 1) {
        try {
            const collection = await this.getCollectionById(collectionId);
            if (!collection || !collection.candyMachineAddress) {
                throw new Error('Collection or Candy Machine not found');
            }
            const mintedNfts = [];
            for (let i = 0; i < quantity; i++) {
                const mockNftAddress = `NFT_${collectionId}_${userWallet}_${Date.now()}_${i}`;
                mintedNfts.push(mockNftAddress);
                console.log(`Mock ticket minted: ${mockNftAddress}`);
            }
            return mintedNfts;
        }
        catch (error) {
            console.error('Error minting ticket:', error);
            throw new Error(`Failed to mint ticket: ${error.message}`);
        }
    }
    async getCandyMachineInfo(candyMachineAddress) {
        try {
            return {
                address: candyMachineAddress,
                itemsMinted: Math.floor(Math.random() * 100),
                itemsAvailable: 1000,
                price: 0.1,
                isFullyLoaded: true,
                isActive: true,
            };
        }
        catch (error) {
            console.error('Error getting Candy Machine info:', error);
            throw new Error(`Failed to get Candy Machine info: ${error.message}`);
        }
    }
    async getCollectionById(collectionId) {
        return await this.collectionService.getCollectionById(collectionId);
    }
}
exports.CandyMachineService = CandyMachineService;
//# sourceMappingURL=CandyMachineService.js.map
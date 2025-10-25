"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachineService = void 0;
const web3_js_1 = require("@solana/web3.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CandyMachineService {
    constructor(solanaService, collectionService) {
        this.solanaService = solanaService;
        this.collectionService = collectionService;
        this.testWallets = this.loadTestWallets();
    }
    loadTestWallets() {
        try {
            const walletsPath = path_1.default.join(process.cwd(), 'data', 'test-wallets.json');
            const data = fs_1.default.readFileSync(walletsPath, 'utf8');
            const parsed = JSON.parse(data);
            return parsed.testWallets || [];
        }
        catch (error) {
            console.error('Error loading test wallets:', error);
            return [];
        }
    }
    getTestWallet(walletAddress) {
        return this.testWallets.find(w => w.wallet === walletAddress) || null;
    }
    createKeypairFromPrivateKey(privateKey) {
        return web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKey));
    }
    async createCollectionNFT(collection) {
        try {
            console.log('🎨 Starting Collection NFT creation...');
            console.log('Collection data:', {
                name: collection.name,
                eventCreator: collection.eventCreator,
                wallet: this.solanaService.getWalletAddress()
            });
            const metaplex = this.solanaService.getMetaplex();
            const balance = await this.solanaService.getBalance();
            console.log('💰 Wallet balance:', balance, 'SOL');
            if (balance < 0.01) {
                throw new Error('Insufficient SOL balance for transaction');
            }
            console.log('🎨 Creating Collection NFT with URI metadata...');
            const metadataUri = `https://api.etcha-candy.com/metadata/${collection.id}`;
            const collectionNft = await metaplex.nfts().create({
                name: collection.name,
                symbol: collection.name.substring(0, 4).toUpperCase(),
                uri: metadataUri,
                sellerFeeBasisPoints: 250,
                creators: [
                    {
                        address: this.solanaService.getKeypair().publicKey,
                        share: 100,
                    }
                ],
                isCollection: true,
            });
            console.log('🎉 Collection NFT created successfully!');
            console.log('NFT Address:', collectionNft.nft.address.toString());
            console.log('NFT Symbol:', collectionNft.nft.symbol);
            console.log('Metadata URI:', metadataUri);
            return collectionNft.nft.address.toString();
        }
        catch (error) {
            console.error('❌ Error creating Collection NFT:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw new Error(`Failed to create Collection NFT: ${error.message}`);
        }
    }
    async createCandyMachine(collection) {
        try {
            console.log('🍭 Creating Candy Machine for collection:', collection.name);
            if (!collection.collectionNftAddress) {
                throw new Error('Collection NFT must be created before Candy Machine');
            }
            const metaplex = this.solanaService.getMetaplex();
            const balance = await this.solanaService.getBalance();
            console.log('💰 Platform wallet balance:', balance, 'SOL');
            if (balance < 0.1) {
                throw new Error('Insufficient SOL balance for Candy Machine creation');
            }
            const candyMachineConfig = {
                price: collection.ticketPrice,
                number: collection.maxTickets,
                sellerFeeBasisPoints: 250,
                symbol: collection.name.substring(0, 4).toUpperCase(),
                creators: [
                    {
                        address: this.solanaService.getKeypair().publicKey,
                        share: 100,
                    }
                ],
                collection: {
                    address: new web3_js_1.PublicKey(collection.collectionNftAddress),
                    updateAuthority: this.solanaService.getKeypair(),
                },
                uri: `https://api.etcha-candy.com/ticket-metadata/${collection.id}`,
            };
            console.log('🍭 Creating Candy Machine with config:', {
                price: candyMachineConfig.price,
                number: candyMachineConfig.number,
                collection: collection.collectionNftAddress
            });
            console.log('🔍 Debug - collection.ticketPrice:', collection.ticketPrice);
            console.log('🔍 Debug - candyMachineConfig.price:', candyMachineConfig.price);
            console.log('🔍 Debug - typeof candyMachineConfig.price:', typeof candyMachineConfig.price);
            const candyMachine = await metaplex.candyMachines().create({
                itemsAvailable: candyMachineConfig.number,
                sellerFeeBasisPoints: candyMachineConfig.sellerFeeBasisPoints,
                symbol: candyMachineConfig.symbol,
                creators: candyMachineConfig.creators,
                collection: candyMachineConfig.collection,
                guards: {
                    solPayment: {
                        amount: {
                            basisPoints: BigInt(Math.floor(candyMachineConfig.price * 1e9)),
                            currency: {
                                symbol: 'SOL',
                                decimals: 9,
                            },
                        },
                        destination: this.solanaService.getKeypair().publicKey,
                    },
                },
            });
            console.log('🎉 Candy Machine created successfully!');
            console.log('Candy Machine object:', JSON.stringify(candyMachine, null, 2));
            console.log('Candy Machine keys:', Object.keys(candyMachine));
            console.log('Trying to extract address from:', {
                candyMachine: candyMachine.candyMachine
            });
            const candyMachineAddress = this.asBase58Address(candyMachine.candyMachine);
            if (!(typeof candyMachineAddress === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(candyMachineAddress))) {
                throw new Error('CandyMachine address must be a base58 string');
            }
            console.log('Candy Machine Address:', candyMachineAddress);
            console.log('🎫 Adding items to Candy Machine...');
            await this.addItemsToCandyMachine(candyMachineAddress, collection);
            return candyMachineAddress;
        }
        catch (error) {
            console.error('❌ Error creating Candy Machine:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw new Error(`Failed to create Candy Machine: ${error.message}`);
        }
    }
    async mintTicket(collectionId, userWallet, quantity = 1) {
        try {
            console.log('🎫 Starting ticket minting...');
            console.log('Collection ID:', collectionId);
            console.log('User Wallet:', userWallet);
            console.log('Quantity:', quantity);
            console.log('🔍 Expected Candy Machine address:', 'jUn8Z1kLAqM3nKsdThPzRs6vNNQaCd6YTav9xMv8Q5G');
            const collection = await this.getCollectionById(collectionId);
            if (!collection) {
                throw new Error('Collection not found');
            }
            if (!collection.candyMachineAddress || collection.candyMachineAddress === '[object Object]') {
                console.log('🍭 Candy Machine not found or invalid, creating...');
                console.log('Current candyMachineAddress:', collection.candyMachineAddress);
                const candyMachineAddress = await this.createCandyMachine(collection);
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
                const updatedCollection = await this.getCollectionById(collectionId);
                if (!updatedCollection) {
                    throw new Error('Failed to update collection with Candy Machine');
                }
                collection.candyMachineAddress = candyMachineAddress;
            }
            const testWallet = this.getTestWallet(userWallet);
            if (!testWallet) {
                throw new Error('Test wallet not found');
            }
            const userKeypair = this.createKeypairFromPrivateKey(testWallet.privateKey);
            const userMetaplex = this.solanaService.createMetaplexForUser(userKeypair);
            const userBalance = await this.solanaService.getConnection().getBalance(userKeypair.publicKey);
            const userBalanceSOL = userBalance / 1e9;
            console.log('💰 User wallet balance:', userBalanceSOL, 'SOL');
            console.log('👤 User wallet address:', userKeypair.publicKey.toBase58());
            if (userBalanceSOL < collection.ticketPrice * quantity) {
                throw new Error(`Insufficient SOL balance. Required: ${collection.ticketPrice * quantity} SOL, Available: ${userBalanceSOL} SOL`);
            }
            const mintedNfts = [];
            const ticketNumbers = [];
            for (let i = 0; i < quantity; i++) {
                console.log(`🎫 Minting ticket ${i + 1}/${quantity}...`);
                console.log('🔍 Looking for Candy Machine at address:', collection.candyMachineAddress);
                console.log('🔍 Address type:', typeof collection.candyMachineAddress);
                const candyMachineAddress = collection.candyMachineAddress;
                console.log('✅ Using Candy Machine address:', candyMachineAddress);
                console.log('🔍 Creating PublicKey from:', candyMachineAddress);
                const candyMachinePublicKey = new web3_js_1.PublicKey(candyMachineAddress);
                console.log('🔍 PublicKey created successfully:', candyMachinePublicKey.toBase58());
                console.log('🔍 Searching for Candy Machine on blockchain...');
                const candyMachine = await userMetaplex.candyMachines().findByAddress({
                    address: candyMachinePublicKey,
                });
                console.log('✅ Candy Machine found on blockchain!');
                const mintResult = await userMetaplex.candyMachines().mint({
                    candyMachine,
                    collectionUpdateAuthority: this.solanaService.getKeypair().publicKey,
                });
                const nftAddress = mintResult.nft.address.toString();
                const ticketNumber = String(collection.candyMachineConfig?.minted || 0 + i + 1).padStart(3, '0');
                mintedNfts.push(nftAddress);
                ticketNumbers.push(ticketNumber);
                console.log(`✅ Ticket ${ticketNumber} minted: ${nftAddress}`);
            }
            const currentMinted = collection.candyMachineConfig?.minted || 0;
            await this.collectionService.updateCollection(collectionId, {
                candyMachineConfig: {
                    ...collection.candyMachineConfig,
                    minted: currentMinted + quantity
                }
            });
            console.log('🎉 All tickets minted successfully!');
            console.log('Minted NFTs:', mintedNfts);
            console.log('Ticket Numbers:', ticketNumbers);
            return { nftAddresses: mintedNfts, ticketNumbers };
        }
        catch (error) {
            console.error('❌ Error minting ticket:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw new Error(`Failed to mint ticket: ${error.message}`);
        }
    }
    async getCandyMachineInfo(candyMachineAddress) {
        try {
            const metaplex = this.solanaService.getMetaplex();
            const candyMachine = await metaplex.candyMachines().findByAddress({
                address: new web3_js_1.PublicKey(candyMachineAddress),
            });
            return {
                address: candyMachineAddress,
                itemsMinted: candyMachine.itemsMinted,
                itemsAvailable: candyMachine.itemsAvailable,
                price: 0,
                isFullyLoaded: candyMachine.isFullyLoaded,
                isActive: true,
                symbol: candyMachine.symbol,
                sellerFeeBasisPoints: candyMachine.sellerFeeBasisPoints,
            };
        }
        catch (error) {
            console.error('Error getting Candy Machine info:', error);
            throw new Error(`Failed to get Candy Machine info: ${error.message}`);
        }
    }
    async getTestWallets() {
        return this.testWallets;
    }
    async getUserTickets(userWallet) {
        try {
            const testWallet = this.getTestWallet(userWallet);
            if (!testWallet) {
                throw new Error('Test wallet not found');
            }
            const userKeypair = this.createKeypairFromPrivateKey(testWallet.privateKey);
            const metaplex = this.solanaService.getMetaplex();
            const nfts = await metaplex.nfts().findAllByOwner({
                owner: userKeypair.publicKey,
            });
            return nfts.map(nft => nft.address.toString());
        }
        catch (error) {
            console.error('Error getting user tickets:', error);
            throw new Error(`Failed to get user tickets: ${error.message}`);
        }
    }
    async validateTicket(nftAddress, collectionId) {
        try {
            const metaplex = this.solanaService.getMetaplex();
            const nft = await metaplex.nfts().findByMint({
                mintAddress: new web3_js_1.PublicKey(nftAddress),
            });
            if (!nft) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error validating ticket:', error);
            return false;
        }
    }
    async getCollectionById(collectionId) {
        return await this.collectionService.getCollectionById(collectionId);
    }
    async addItemsToCandyMachine(candyMachineAddress, collection) {
        try {
            const metaplex = this.solanaService.getMetaplex();
            const candyMachine = await metaplex.candyMachines().findByAddress({
                address: new web3_js_1.PublicKey(candyMachineAddress),
            });
            console.log('🎫 Adding items to Candy Machine...');
            const items = Array.from({ length: collection.maxTickets }, (_, i) => ({
                name: `Ticket #${String(i + 1).padStart(3, '0')}`,
                uri: `https://api.etcha-candy.com/ticket-metadata/${collection.id}/${i + 1}`,
            }));
            console.log(`🎫 Adding ${items.length} items to Candy Machine...`);
            const batchSize = 5;
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                console.log(`🎫 Adding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} (${batch.length} items)...`);
                await metaplex.candyMachines().insertItems({
                    candyMachine,
                    items: batch,
                });
                console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} added successfully!`);
            }
            console.log('✅ All items added to Candy Machine successfully!');
        }
        catch (error) {
            console.error('❌ Error adding items to Candy Machine:', error);
            throw new Error(`Failed to add items to Candy Machine: ${error.message}`);
        }
    }
    asBase58Address(x) {
        console.log('asBase58Address input:', x, typeof x);
        if (typeof x === 'string') {
            try {
                return new web3_js_1.PublicKey(x).toBase58();
            }
            catch {
                throw new Error(`Invalid base58 string: ${x}`);
            }
        }
        if (x && typeof x === 'object' && 'toBase58' in x && typeof x.toBase58 === 'function') {
            return x.toBase58();
        }
        if (x && typeof x === 'object') {
            const obj = x;
            if (obj.publicKey && 'toBase58' in obj.publicKey && typeof obj.publicKey.toBase58 === 'function') {
                return obj.publicKey.toBase58();
            }
            if (obj.address && 'toBase58' in obj.address && typeof obj.address.toBase58 === 'function') {
                return obj.address.toBase58();
            }
            if (obj.pubkey && 'toBase58' in obj.pubkey && typeof obj.pubkey.toBase58 === 'function') {
                return obj.pubkey.toBase58();
            }
            if (obj.pubkey && typeof obj.pubkey === 'string') {
                return obj.pubkey;
            }
            if (obj.pubkey && typeof obj.pubkey === 'object') {
                if (obj.pubkey.publicKey && 'toBase58' in obj.pubkey.publicKey && typeof obj.pubkey.publicKey.toBase58 === 'function') {
                    return obj.pubkey.publicKey.toBase58();
                }
                if (obj.pubkey.address && 'toBase58' in obj.pubkey.address && typeof obj.pubkey.address.toBase58 === 'function') {
                    return obj.pubkey.address.toBase58();
                }
            }
        }
        const s = String(x);
        if (s === '[object Object]') {
            throw new Error(`Cannot extract address from object: ${JSON.stringify(x)}`);
        }
        try {
            return new web3_js_1.PublicKey(s).toBase58();
        }
        catch {
            throw new Error(`Invalid public key-like value: ${s}`);
        }
    }
}
exports.CandyMachineService = CandyMachineService;
//# sourceMappingURL=CandyMachineService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaService = void 0;
const web3_js_1 = require("@solana/web3.js");
const js_1 = require("@metaplex-foundation/js");
class SolanaService {
    constructor(config) {
        this.connection = new web3_js_1.Connection(config.solana.rpcUrl, {
            commitment: config.solana.commitment,
        });
        const privateKey = process.env.SOLANA_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
        }
        const privateKeyArray = JSON.parse(privateKey);
        this.keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
        this.metaplex = js_1.Metaplex.make(this.connection)
            .use((0, js_1.keypairIdentity)(this.keypair));
        console.log('Solana service initialized with wallet:', this.keypair.publicKey.toString());
    }
    getConnection() {
        return this.connection;
    }
    getMetaplex() {
        return this.metaplex;
    }
    getKeypair() {
        return this.keypair;
    }
    getWalletAddress() {
        return this.keypair.publicKey.toString();
    }
    async getBalance() {
        const balance = await this.connection.getBalance(this.keypair.publicKey);
        return balance / 1e9;
    }
    async isWalletValid(address) {
        try {
            new web3_js_1.PublicKey(address);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.SolanaService = SolanaService;
//# sourceMappingURL=SolanaService.js.map
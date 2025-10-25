import { Connection, Keypair } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { PlatformConfig } from '../types';
export declare class SolanaService {
    private connection;
    private metaplex;
    private keypair;
    constructor(config: PlatformConfig);
    getConnection(): Connection;
    getMetaplex(): Metaplex;
    getKeypair(): Keypair;
    getWalletAddress(): string;
    getBalance(): Promise<number>;
    isWalletValid(address: string): Promise<boolean>;
}
//# sourceMappingURL=SolanaService.d.ts.map
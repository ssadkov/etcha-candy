import { Collection, TestWallet } from '../types';
import { SolanaService } from './SolanaService';
import { CollectionService } from './CollectionService';
export declare class CandyMachineService {
    private solanaService;
    private collectionService;
    private testWallets;
    constructor(solanaService: SolanaService, collectionService: CollectionService);
    private loadTestWallets;
    private getTestWallet;
    private createKeypairFromPrivateKey;
    createCollectionNFT(collection: Collection): Promise<string>;
    createCandyMachine(collection: Collection): Promise<string>;
    mintTicket(collectionId: string, userWallet: string, quantity?: number): Promise<{
        nftAddresses: string[];
        ticketNumbers: string[];
    }>;
    getCandyMachineInfo(candyMachineAddress: string): Promise<any>;
    getTestWallets(): Promise<TestWallet[]>;
    getUserTickets(userWallet: string, collectionId?: string): Promise<string[]>;
    getUserTicketsFromPlatform(userWallet: string): Promise<string[]>;
    validateTicket(nftAddress: string, collectionId: string): Promise<boolean>;
    private getCollectionById;
    addItemsToCandyMachine(candyMachineAddress: string, collection: Collection): Promise<void>;
    private asBase58Address;
}
//# sourceMappingURL=CandyMachineService.d.ts.map
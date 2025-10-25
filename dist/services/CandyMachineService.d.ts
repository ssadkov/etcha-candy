import { Collection } from '../types';
import { SolanaService } from './SolanaService';
import { CollectionService } from './CollectionService';
export declare class CandyMachineService {
    private solanaService;
    private collectionService;
    constructor(solanaService: SolanaService, collectionService: CollectionService);
    createCandyMachine(collection: Collection): Promise<string>;
    mintTicket(collectionId: string, userWallet: string, quantity?: number): Promise<string[]>;
    getCandyMachineInfo(candyMachineAddress: string): Promise<any>;
    private getCollectionById;
}
//# sourceMappingURL=CandyMachineService.d.ts.map
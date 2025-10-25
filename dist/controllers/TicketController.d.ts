import { Request, Response } from 'express';
import { CandyMachineService } from '../services/CandyMachineService';
import { CollectionService } from '../services/CollectionService';
import { SolanaService } from '../services/SolanaService';
export declare class TicketController {
    private candyMachineService;
    private collectionService;
    private solanaService;
    constructor(candyMachineService: CandyMachineService, collectionService: CollectionService, solanaService: SolanaService);
    private validateMintTicket;
    private validateValidateTicket;
    mintTicket(req: Request, res: Response): Promise<void>;
    getUserTickets(req: Request, res: Response): Promise<void>;
    getUserTicketsFromPlatform(req: Request, res: Response): Promise<void>;
    validateTicket(req: Request, res: Response): Promise<void>;
    getTestWallets(req: Request, res: Response): Promise<void>;
    addItemsToCandyMachine(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=TicketController.d.ts.map
import { Request, Response } from 'express';
import { CollectionService } from '../services/CollectionService';
import { CandyMachineService } from '../services/CandyMachineService';
export declare class CollectionController {
    private collectionService;
    private candyMachineService;
    constructor(collectionService: CollectionService, candyMachineService: CandyMachineService);
    private validateCreateCollection;
    createCollection(req: Request, res: Response): Promise<void>;
    getCollections(req: Request, res: Response): Promise<void>;
    getCollectionById(req: Request, res: Response): Promise<void>;
    updateCollection(req: Request, res: Response): Promise<void>;
    deleteCollection(req: Request, res: Response): Promise<void>;
    createCandyMachine(req: Request, res: Response): Promise<void>;
    getCandyMachineInfo(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CollectionController.d.ts.map
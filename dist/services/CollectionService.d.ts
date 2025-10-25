import { Collection, CreateCollectionRequest } from '../types';
export declare class CollectionService {
    private collectionsPath;
    constructor();
    private ensureDataFile;
    private readCollections;
    private writeCollections;
    createCollection(data: CreateCollectionRequest): Promise<Collection>;
    getCollections(): Promise<Collection[]>;
    getCollectionById(id: string): Promise<Collection | null>;
    updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null>;
    deleteCollection(id: string): Promise<boolean>;
    private generateId;
}
//# sourceMappingURL=CollectionService.d.ts.map
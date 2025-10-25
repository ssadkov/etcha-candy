export interface PlatformConfig {
  platform: {
    name: string;
    walletAddress: string;
    royalty: number;
    description: string;
  };
  solana: {
    network: string;
    rpcUrl: string;
    commitment: string;
  };
  server: {
    port: number;
    corsOrigin: string;
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
}

export interface Collection {
  id: string;
  eventCreator: string;
  eventCreatorName: string;
  name: string;
  description: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketPrice: number;
  maxTickets: number;
  imageUrl: string;
  candyMachineAddress?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionRequest {
  eventCreator: string;
  eventCreatorName: string;
  name: string;
  description: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketPrice: number;
  maxTickets: number;
  imageUrl: string;
}

export interface MintTicketRequest {
  collectionId: string;
  userWallet: string;
  quantity?: number;
}

export interface TicketMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    creators: Array<{
      address: string;
      verified: boolean;
      share: number;
    }>;
  };
}

export interface ValidateTicketRequest {
  mintAddress: string;
  collectionId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

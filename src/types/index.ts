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
  collectionNftAddress?: string;
  candyMachineAddress?: string;
  candyMachineConfig?: CandyMachineConfig;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CandyMachineConfig {
  price: number;           // Цена в SOL
  supply: number;           // Максимальное количество билетов
  minted: number;           // Уже заминченные билеты
  isActive: boolean;        // Активен ли минтинг
  createdAt?: string;       // Дата создания Candy Machine
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

export interface MintTicketResponse {
  success: boolean;
  ticketNftAddresses: string[];
  transactionSignature: string;
  ticketNumbers: string[];
  error?: string;
}

export interface TestWallet {
  name: string;
  wallet: string;
  privateKey: number[];
}

export interface MintingRecord {
  id: string;
  collectionId: string;
  userWallet: string;
  ticketNftAddresses: string[];
  ticketNumbers: string[];
  transactionSignature: string;
  amountPaid: number;
  quantity: number;
  mintedAt: string;
  status: 'success' | 'failed';
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

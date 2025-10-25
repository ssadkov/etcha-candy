# Etcha Candy Backend

NFT ticket platform backend using Metaplex Candy Machine on Solana blockchain.

## 🎯 Current Status: Collection NFT Creation ✅

**Collection NFTs are successfully created on Solana devnet!**

### ✅ What Works Now:
- **Collection NFT Creation** - Real NFTs created on blockchain
- **Metadata URI Storage** - Metadata links stored on-chain (no IPFS/Arweave)
- **Platform Wallet Integration** - Uses platform wallet as creator
- **JSON Database** - Collections stored locally for development
- **REST API** - Full CRUD operations for collections
- **Health Monitoring** - Server status and wallet balance checks

### 🔗 Blockchain Integration:
- **Network**: Solana Devnet
- **Collection NFTs**: Created with real blockchain transactions
- **Creator**: Platform wallet (100% royalty share)
- **Metadata**: Stored via URI links to API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure platform settings in `config/platform.json`

3. Set up environment variables:
```bash
# Copy example file
cp env.example .env

# Edit .env and add your Solana private key
SOLANA_PRIVATE_KEY="[1,2,3,...]" # Array format from Solana CLI
```

4. Run development server:
```bash
npm run dev
```

## API Endpoints

### Collections
- `POST /api/collections` - Create new collection
- `GET /api/collections` - List all collections
- `GET /api/collections/:id` - Get collection details
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:id/candy-machine` - Create Candy Machine
- `GET /api/collections/:id/candy-machine` - Get Candy Machine info

### Tickets
- `POST /api/tickets/mint` - Mint ticket
- `GET /api/tickets/user/:wallet` - Get user tickets
- `POST /api/tickets/validate` - Validate ticket

### Health
- `GET /health` - Health check endpoint

## Environment Variables

- `SOLANA_PRIVATE_KEY` - Platform wallet private key (required)
- `SOLANA_RPC_URL` - Solana RPC endpoint (default: devnet)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 🏗️ Technical Architecture

### Project Structure
```
src/
├── controllers/     # API controllers
│   ├── CollectionController.ts  # Collection CRUD operations
│   └── TicketController.ts       # Ticket operations (mock)
├── services/        # Business logic services
│   ├── SolanaService.ts         # Blockchain connection & wallet
│   ├── CollectionService.ts     # Collection management
│   └── CandyMachineService.ts   # NFT & Candy Machine operations
├── types/           # TypeScript interfaces
│   └── index.ts     # Collection, PlatformConfig types
└── index.ts         # Main application file

config/
└── platform.json    # Platform configuration

data/
└── collections.json # Collections storage (JSON database)
```

### Key Components

**SolanaService:**
- Manages Solana connection (devnet)
- Handles platform wallet operations
- Provides Metaplex SDK instance

**CollectionService:**
- CRUD operations for collections
- JSON file-based storage
- Integrates with CandyMachineService for NFT creation

**CandyMachineService:**
- Creates Collection NFTs on blockchain
- Uses URI-based metadata (no IPFS/Arweave)
- Handles creator configuration and royalties

### Blockchain Integration Details

**Metaplex SDK Version:** `@metaplex-foundation/js`
**Network:** Solana Devnet
**Wallet:** Platform-controlled keypair
**Metadata Storage:** URI links to API endpoints
**Creator Model:** Single creator (platform) with 100% share

## Getting Solana Private Key

1. Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
2. Generate new keypair: `solana-keygen new`
3. Get private key array: `solana-keygen pubkey --keypair ~/.config/solana/id.json --outfile /dev/stdout`
4. Use the array format in your `.env` file

## 🧪 Testing & Verification

### 1. API Testing
```bash
# Start server
npm run dev

# Test Collection NFT creation
node test-collection-nft.js

# Test all endpoints
node test-api.js

# Verify NFTs on blockchain
node verify-blockchain.js
```

### 2. Blockchain Verification
**✅ YES - You can verify collections on blockchain!**

**Methods to check:**
1. **Solana Explorer** (Recommended):
   - Visit: https://explorer.solana.com/
   - Search by Collection NFT address
   - Switch to "Devnet" cluster
   - View transaction history and metadata

2. **Solana CLI**:
   ```bash
   # Check NFT details
   solana account <COLLECTION_NFT_ADDRESS> --output json
   
   # Check metadata
   solana account <METADATA_ACCOUNT_ADDRESS> --output json
   ```

3. **Programmatic Check**:
   ```javascript
   // Check if NFT exists on blockchain
   const nftAccount = await connection.getAccountInfo(new PublicKey(nftAddress));
   console.log('NFT exists:', nftAccount !== null);
   ```

### 3. API Status Check
```bash
# Health check
curl http://localhost:3000/health

# List all collections
curl http://localhost:3000/api/collections

# Get specific collection
curl http://localhost:3000/api/collections/{id}
```

**Current API Status:**
- ✅ **Health endpoint** - Working
- ✅ **Collection CRUD** - Working  
- ✅ **Collection NFT creation** - Working
- 🔄 **Candy Machine** - Mock implementation
- 🔄 **Ticket minting** - Mock implementation
- 🔄 **Ticket validation** - Mock implementation

### 4. Blockchain Verification Results
**✅ VERIFIED: Collection NFTs exist on Solana Devnet**

**NFT Details:**
- **NFT 1**: `EVhit261jZVzzsv1Pw7f8f4rWTjk1LwDHbjzBJix6i9m`
  - Account size: 82 bytes
  - Owner: Token Program
  - Created: 2025-10-25T18:00:43.000Z
  - Transaction: `4ibVse9V9Xw5qvvnsbhUep5XxbAto8ASMdwCJBWz5kHFJHxh4hJbB4KRGMdHbwMrVAcA5TRZA9fWjPxWEratxBLm`

- **NFT 2**: `9RiPpuMwYZFaT54jz4qqQHMqonQEe3XQhdjRCSRhGX8m`
  - Account size: 82 bytes
  - Owner: Token Program
  - Created: 2025-10-25T18:01:01.000Z
  - Transaction: `2QPPF1S3QUvDikNfsqTuDbeBA7CzSxwFZ5oVmM2T5ThHjooQbBwKLQrGETDqEftP6AZ8zCjKY8ZjMcPewGXY3uP3`

**Verification Methods:**
- ✅ Solana Explorer links working
- ✅ Account info accessible via RPC
- ✅ Transaction history available
- ✅ Metadata URIs stored on-chain

## 🎨 Collection NFT Examples

**Successfully Created Collection NFTs:**
- `EVhit261jZVzzsv1Pw7f8f4rWTjk1LwDHbjzBJix6i9m` - "FIXED Collection NFT"
- `9RiPpuMwYZFaT54jz4qqQHMqonQEe3XQhdjRCSRhGX8m` - "NFT Test Collection"

**View on Solana Explorer:**
- [Collection 1](https://explorer.solana.com/address/EVhit261jZVzzsv1Pw7f8f4rWTjk1LwDHbjzBJix6i9m?cluster=devnet)
- [Collection 2](https://explorer.solana.com/address/9RiPpuMwYZFaT54jz4qqQHMqonQEe3XQhdjRCSRhGX8m?cluster=devnet)

## 🔧 How It Works

### 1. Collection Creation Flow:
```
API Request → Validate Data → Create Collection NFT → Save to JSON → Return Response
```

### 2. Collection NFT Details:
- **Name**: Event collection name
- **Symbol**: First 4 characters of name (uppercase)
- **URI**: `https://api.etcha-candy.com/metadata/{collectionId}`
- **Royalty**: 2.5% (250 basis points)
- **Creator**: Platform wallet (100% share)
- **Type**: Collection NFT (`isCollection: true`)

### 3. Metadata Structure:
```json
{
  "name": "Event Collection Name",
  "description": "Event description",
  "image": "https://example.com/image.jpg",
  "attributes": [
    {"trait_type": "Event Name", "value": "Concert 2024"},
    {"trait_type": "Date", "value": "2024-12-31"},
    {"trait_type": "Location", "value": "Main Arena"},
    {"trait_type": "Max Tickets", "value": 100},
    {"trait_type": "Price", "value": "0.1 SOL"}
  ]
}
```

## 🚀 Next Development Steps

### Phase 1: Candy Machine Integration
- [ ] Create real Candy Machine for each collection
- [ ] Configure minting parameters (price, supply, guards)
- [ ] Link Candy Machine to Collection NFT

### Phase 2: Ticket Minting
- [ ] Implement real ticket minting via Candy Machine
- [ ] Add payment processing (SOL transfers)
- [ ] Create individual ticket NFTs

### Phase 3: Secondary Market
- [ ] Integrate Metaplex Auction House
- [ ] Enable ticket reselling
- [ ] Implement royalty distribution

### Phase 4: Production Features
- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] Wallet authentication
- [ ] Real metadata upload (IPFS/Arweave)
- [ ] Comprehensive logging and monitoring

## ❓ FAQ

### Q: Могу ли я проверить коллекции на чейне (не только JSON)?
**A: ✅ ДА!** Collection NFTs создаются на реальном блокчейне Solana Devnet:

1. **Solana Explorer**: https://explorer.solana.com/
   - Поиск по адресу NFT
   - Переключение на Devnet
   - Просмотр транзакций и метаданных

2. **Программная проверка**: `node verify-blockchain.js`
   - Проверка существования аккаунта
   - Получение информации о транзакциях
   - Валидация метаданных

3. **Solana CLI**:
   ```bash
   solana account <NFT_ADDRESS> --output json
   ```

### Q: Работают ли API?
**A: ✅ ДА!** Все основные API работают:

- ✅ **Health**: `GET /health` - статус сервера
- ✅ **Collections**: `GET /api/collections` - список коллекций
- ✅ **Create Collection**: `POST /api/collections` - создание с NFT
- ✅ **Collection Details**: `GET /api/collections/:id` - детали коллекции
- 🔄 **Candy Machine**: Mock implementation (следующий этап)
- 🔄 **Ticket Minting**: Mock implementation (следующий этап)

### Q: Что дальше?
**A: Следующие этапы разработки:**

1. **Candy Machine Integration** - создание реальных Candy Machine
2. **Ticket Minting** - минтинг билетов через Candy Machine  
3. **Payment Processing** - обработка SOL платежей
4. **Auction House** - вторичный рынок билетов

**Текущий статус**: Collection NFT создание полностью реализовано и работает! 🎉

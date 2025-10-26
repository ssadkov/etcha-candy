# Etcha Candy Backend

NFT ticket platform backend using Metaplex Candy Machine on Solana blockchain.

## 🎯 Current Status: Full NFT Minting Pipeline ✅

**Complete NFT minting pipeline is working on Solana devnet!**

### ✅ What Works Now:
- **Collection NFT Creation** - Real NFTs created on blockchain
- **Candy Machine Creation** - Automated Candy Machine setup with items
- **NFT Minting** - Users can mint tickets using their own wallets
- **Multi-User Support** - Bob and Charlie successfully minted NFTs
- **Metadata URI Storage** - Metadata links stored on-chain (no IPFS/Arweave)
- **Platform Wallet Integration** - Uses platform wallet as creator
- **JSON Database** - Collections stored locally for development
- **REST API** - Full CRUD operations for collections
- **Health Monitoring** - Server status and wallet balance checks

### 🔗 Blockchain Integration:
- **Network**: Solana Devnet
- **Collection NFTs**: Created with real blockchain transactions
- **Candy Machines**: Automated creation with proper item configuration
- **NFT Minting**: Real blockchain transactions with user wallets
- **Creator**: Platform wallet (100% royalty share)
- **Metadata**: Stored via URI links to API endpoints

## 🧪 Testing Results

### ✅ Bob & Charlie Minting Test - SUCCESSFUL

**Test Date:** October 25, 2025  
**Collection:** "Short Test Collection" (`collection_1761424771087_lqluhspsk`)

#### Test Results:
- **Bob Wallet:** `GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7`
  - ✅ **NFT Minted:** `G2jAUxWjpn1xho8YFPBtEvjiSTQj321cCqdumcF2USzs`
  - ✅ **Ticket Number:** `002`
  - ✅ **Status:** SUCCESS

- **Charlie Wallet:** `4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy`
  - ✅ **NFT Minted:** `CWpdejjwcb6N3UKwY7TXWhnRkLGkwgiAVAjNtLdZS875`
  - ✅ **Ticket Number:** `003`
  - ✅ **Status:** SUCCESS

#### Key Achievements:
1. **Multi-User Minting** - Different users can mint from the same Candy Machine
2. **Correct Wallet Usage** - Each user's wallet is properly used for minting
3. **Sequential Ticket Numbers** - Tickets are numbered correctly (002, 003)
4. **Real Blockchain Transactions** - All NFTs are real on Solana devnet
5. **Proper Payment Handling** - Each user pays from their own wallet

#### Technical Details:
- **Candy Machine Address:** Created automatically with collection
- **Items Available:** 5 tickets total
- **Price per Ticket:** 0.1 SOL
- **Minting Method:** Metaplex Candy Machine V3
- **User Authentication:** Private key-based wallet authentication

### 🔧 Testing Process

#### Step 1: Collection Creation
```bash
# Create collection with short event name (to avoid 32-char limit)
node create-short-event-collection.js
```

#### Step 2: Minting Test
```bash
# Test Bob and Charlie minting
node test-bob-charlie-short.js
```

#### Step 3: Verification
- ✅ Collection NFT created on blockchain
- ✅ Candy Machine created with 5 items
- ✅ Bob successfully minted NFT #002
- ✅ Charlie successfully minted NFT #003
- ✅ Each user paid from their own wallet
- ✅ NFTs are real on Solana devnet

### 🚨 Issues Resolved

1. **Candy Machine Empty Error** - Fixed by ensuring proper item configuration
2. **Transaction Too Large** - Implemented batching for item insertion
3. **Name Length Limit** - Shortened ticket names to fit 32-character limit
4. **User Wallet Authentication** - Fixed Metaplex instance per user
5. **Price Configuration** - Corrected solPayment guard configuration

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

## 📖 Creating Collections

### How to Create a New Collection

To create a new ticket collection, use the **Create Collection API**:

#### API Endpoint
```
POST /api/collections
```

#### Request Body
```json
{
  "name": "Your Event Name",
  "description": "Event description",
  "eventCreator": "Creator wallet address",
  "eventCreatorName": "Creator Display Name",
  "eventName": "Full Event Name",
  "eventDate": "2025-03-15",
  "eventLocation": "Venue or Online",
  "ticketPrice": 0.25,
  "maxTickets": 200,
  "imageUrl": "https://your-image-url.com/image.png"
}
```

#### Example Request
```javascript
const response = await fetch('http://localhost:3000/api/collections', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Solana workshop',
    description: 'Interactive workshop on Solana blockchain development',
    eventCreator: 'Solana Foundation',
    eventCreatorName: 'Solana Foundation',
    eventName: 'Solana Workshop 2025',
    eventDate: '2025-03-15',
    eventLocation: 'Online',
    ticketPrice: 0.25,
    maxTickets: 200,
    imageUrl: 'https://via.placeholder.com/512x512.png?text=Workshop'
  }),
});
```

#### Response Parameters

The API returns important parameters for **accounting and tracking**:

```json
{
  "success": true,
  "data": {
    "id": "collection_1761507837674_w780dr9if",  // Internal collection ID
    "name": "Solana workshop",
    "eventCreator": "Solana Foundation",
    "eventCreatorName": "Solana Foundation", 
    "eventName": "Solana Workshop 2025",
    "eventDate": "2025-03-15",
    "eventLocation": "Online",
    "ticketPrice": 0.25,
    "maxTickets": 200,
    "minted": 0,
    "status": "active",
    "collectionNftAddress": "Fs5LrF5yEZiPE1mqYjPzrZCZJeCdKekmQL6MKYLimN29",
    "candyMachineAddress": null,  // Set after Candy Machine creation
    "createdAt": "2025-01-26T07:43:57.674Z"
  }
}
```

#### Important Fields for Accounting

1. **`id`** - Internal collection ID (use for all API calls)
2. **`collectionNftAddress`** - On-chain Collection NFT address (for verification)
3. **`candyMachineAddress`** - Candy Machine address (creates after setup)
4. **`ticketPrice`** - Price in SOL for each ticket
5. **`maxTickets`** - Total ticket supply
6. **`minted`** - Number of already minted tickets
7. **`status`** - Collection status (active/inactive)

### Creating Candy Machine

After creating the collection, create a Candy Machine:

#### API Endpoint
```
POST /api/collections/:collectionId/candy-machine
```

#### Example
```javascript
const collectionId = 'collection_1761507837674_w780dr9if';
const response = await fetch(`http://localhost:3000/api/collections/${collectionId}/candy-machine`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    maxSupply: 200,
    price: 0.25
  }),
});
```

#### Response
```json
{
  "success": true,
  "data": {
    "collectionId": "collection_1761507837674_w780dr9if",
    "candyMachineAddress": "5gb2yAVS38gNHZAL1qx5N6t62iVe5vSjA91pZZUJB8yj",
    "itemsAdded": 200,
    "itemPrice": 0.25,
    "status": "ready"
  }
}
```

---

## 🎯 Recent Achievements

### ✅ Solana Workshop Collection Created
- **Collection ID:** `collection_1761507837674_w780dr9if`
- **Collection NFT:** `Fs5LrF5yEZiPE1mqYjPzrZCZJeCdKekmQL6MKYLimN29`
- **Candy Machine:** `5gb2yAVS38gNHZAL1qx5N6t62iVe5vSjA91pZZUJB8yj`
- **Max Tickets:** 200
- **Price:** 0.25 SOL per ticket
- **Status:** Ready for minting

### ✅ Secondary Market Working
- **Auction House:** `FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1`
- **Listings:** Bob has 1 active listing (0.5 SOL)
- **Purchase:** Charlie successfully bought Bob's NFT
- **Platform Fee:** 2.5% (goes to platform wallet)

---

## 🚀 Next Development Steps

### Phase 1: ✅ Candy Machine Integration (DONE)
- [x] Create real Candy Machine for each collection
- [x] Configure minting parameters (price, supply, guards)
- [x] Link Candy Machine to Collection NFT

### Phase 2: Ticket Minting
- [x] Implement real ticket minting via Candy Machine
- [x] Add payment processing (SOL transfers)
- [x] Create individual ticket NFTs

### Phase 3: ✅ Secondary Market (DONE)
- [x] Integrate Metaplex Auction House
- [x] Enable ticket reselling
- [x] Implement royalty distribution

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

# Etcha Candy Backend

NFT ticket platform backend using Metaplex Candy Machine on Solana.

## Features

- Create NFT collections for events
- Mint tickets through Candy Machine
- Ticket validation system
- User ticket management
- Platform organizer system with additional creators

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

## Project Structure

```
src/
├── controllers/     # API controllers
├── services/        # Business logic services
├── routes/          # Express routes
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
└── index.ts         # Main application file

config/
└── platform.json    # Platform configuration

data/
└── collections.json # Collections storage
```

## Getting Solana Private Key

1. Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
2. Generate new keypair: `solana-keygen new`
3. Get private key array: `solana-keygen pubkey --keypair ~/.config/solana/id.json --outfile /dev/stdout`
4. Use the array format in your `.env` file

## Testing the API

1. Start the server: `npm run dev`
2. Run the test script: `node test-api.js`

The test script will:
- Check server health
- Create a test collection
- Create a Candy Machine
- Mint a test ticket
- Validate the ticket

## Current Implementation Status

✅ **Completed:**
- Project structure and TypeScript setup
- Express server with middleware
- Collection CRUD API
- Candy Machine API (mock implementation)
- Ticket minting API (mock implementation)
- Ticket validation API (mock implementation)
- Error handling and validation
- API documentation

🔄 **Mock Implementation:**
- Candy Machine creation returns mock addresses
- Ticket minting returns mock NFT addresses
- Ticket validation returns mock validation results

🚀 **Next Steps for Production:**
- Replace mock implementations with real Metaplex Candy Machine integration
- Add real NFT metadata upload to IPFS/Arweave
- Implement actual blockchain queries for ticket ownership
- Add wallet-based authentication
- Add database for persistent storage
- Add comprehensive logging and monitoring

# Marketplace Flow - Как работает вторичная продажа NFT

## 🎯 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    AUCTION HOUSE PROGRAM                    │
│          (Metaplex на Solana Blockchain)                   │
└─────────────────────────────────────────────────────────────┘
                            ↑
                            │
                            │ Connects via
                            │ Auction House Address
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
      ┌──────────────┐           ┌──────────────┐
      │   SELLER     │           │    BUYER     │
      │  (Bob)       │           │   (Alice)    │
      └──────────────┘           └──────────────┘
              │                           │
              │ 1. List NFT               │ 2. Buy NFT
              ▼                           ▼
    ┌─────────────────┐          ┌─────────────────┐
    │ NFT Ticket #001 │          │  SOL Payment    │
    │  Owner: Bob     │          │ 0.5 SOL         │
    │ Delegate: AH✓   │◄─────────┤                 │
    └─────────────────┘          └─────────────────┘
         ↓ Transfer                      ↓
    ┌────────────────────────────────────────┐
    │     BLOCKCHAIN TRANSACTION             │
    │  - NFT: Bob → Alice                    │
    │  - SOL: Alice → Bob (0.475)            │
    │  - Fee: → Auction House (0.0125 = 2.5%)│
    └────────────────────────────────────────┘
```

## 📝 Детальный процесс листинга:

### Шаг 1: Пользователь хочет продать NFT
```
User: Bob
NFT: Ticket #001
Price: 0.5 SOL
Wallet: Bob's private key
```

### Шаг 2: Подключение к Auction House (Строки 616-618)
```typescript
// Находим Auction House на блокчейне по адресу
const auctionHouse = await userMetaplex.auctionHouse().findByAddress({
  address: new PublicKey(auctionHouseAddress),
});
```

Что происходит:
- ✅ Читаем PDA Auction House с блокчейна Solana
- ✅ Получаем конфигурацию (sellerFeeBasisPoints: 2.5%)
- ✅ Загружаем authority и treasury accounts

### Шаг 3: Создание листинга (Строки 621-625)
```typescript
const { listing } = await userMetaplex.auctionHouse().list({
  auctionHouse,                      // ← Подключение к Auction House
  mintAccount: new PublicKey(nftMintAddress),
  price: lamports(priceInSol * 1e9), // ← Цена в lamports
});
```

Что происходит на блокчейне:
1. Создается `SellerTradeState` PDA (1 байт)
   - Хранит hash(price, NFT_address, seller)
   - Очень дешевая операция (~0.01 SOL)
   
2. Delegate NFT к Auction House
   ```typescript
   // Auction House становится делегатом NFT
   NFT.delegate = programAsSigner
   ```
   
3. NFT остается в кошельке Bob! ✅
   - Bob полностью контролирует NFT
   - Может снять листинг в любой момент
   - Не теряет ownership до продажи

### Шаг 4: Подключение к программе Auction House
```typescript
metaplex.auctionHouse().list()
         ↓
    SDK отправляет инструкцию:
    Instruction {
      programId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      accounts: [
        seller,
        tokenAccount,
        metadata,
        auctionHouse,
        sellerTradeState
      ]
      data: { price, tokenAmount }
    }
         ↓
    Solana Blockchain Transaction
         ↓
    Auction House Program обрабатывает:
    - Создает PDA SellerTradeState
    - Делегирует NFT
    - Не двигает NFT из кошелька!
```

## 🔍 Где конкретно мы подключаемся?

### В коде:
```typescript:615:625:src/services/CandyMachineService.ts
// Шаг 1: Подключаемся к Auction House
const auctionHouse = await userMetaplex.auctionHouse().findByAddress({
  address: new PublicKey(auctionHouseAddress),  // ← Адрес Auction House PDA
});

// Шаг 2: Вызываем программу Metaplex Auction House
const { listing } = await userMetaplex.auctionHouse().list({
  auctionHouse,                                   // ← Подключаемся к этой Auction House
  mintAccount: new PublicKey(nftMintAddress),    // ← Какой NFT выставляем
  price: lamports(priceInSol * 1e9),             // ← За какую цену
});
```

### На блокчейне:
```
Auction House Address (PDA на Solana):
┌─────────────────────────────────────────┐
│ SellerFeeBasisPoints: 250 (2.5%)      │
│ Authority: Platform wallet             │
│ Treasury: Treasury wallet              │
│ Created: <date>                        │
└─────────────────────────────────────────┘
         ↑
         │ 1. findByAddress() - читаем конфигурацию
         │
SellerTradeState PDA (новый):
┌─────────────────────────────────────────┐
│ Trade State Address (hash-based)      │
│ Contains: hash(price, NFT, seller)    │
│ Size: 1 byte (very cheap!)            │
└─────────────────────────────────────────┘
```

## 💡 Ключевой момент:

**Auction House — это НЕ escrow!**

❌ НЕ так: NFT → Escrow Account → Ждет продажи

✅ Так: NFT → Остается у владельца → Delegate → Продажа

Преимущества:
- ✅ Пользователь не теряет контроль над NFT
- ✅ Может снять листинг в любой момент
- ✅ Нет риска lose NFT в escrow
- ✅ Может выставить на множестве маркетплейсов

## 🔗 Какие компоненты работают:

```
┌──────────────────────────────────────────────────────────┐
│ 1. Metaplex SDK (Локально)                             │
│    └─ metaplex.auctionHouse().list()                    │
│                                                          │
│ 2. Solana RPC Connection                                │
│    └─ Подключается к devnet.solana.com                  │
│                                                          │
│ 3. Auction House Program (On-chain)                     │
│    └─ MPL Auction House Program                         │
│       Address: metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s
│                                                          │
│ 4. NFT Token Account                                     │
│    └─ НФТ в кошельке владельца                          │
│       + Delegate = programAsSigner                      │
└──────────────────────────────────────────────────────────┘
```

## 🎯 Ответ на ваш вопрос:

**Где мы подключаемся к Auction House?**

Ответ: **Строка 616** - `findByAddress()` - это подключение!

```typescript
const auctionHouse = await userMetaplex.auctionHouse().findByAddress({
  address: new PublicKey(auctionHouseAddress),  // ← ВОТ ТУТ ПОДКЛЮЧЕНИЕ!
});
```

Это:
- Читает Auction House account с блокчейна Solana
- Загружает конфигурацию (sellerFeeBasisPoints, authority, etc.)
- Возвращает модель AuctionHouse для использования

Затем на строке **621** - вызываем саму функцию листинга:
```typescript
await userMetaplex.auctionHouse().list({
  auctionHouse,  // ← Используем подключенную Auction House
  ...
})
```

Эти два шага и есть **подключение к Auction House**! 🎉


# Инструкция для тестирования листинга NFT

## Шаг 1: Запустить сервер

В первом терминале (находясь в папке `C:\work\etcha-candy`):

```bash
npm run dev
```

Подождите пока увидите:
```
🚀 Etcha Candy Backend running on port 3000
📡 Solana Network: devnet
🏢 Platform: Etcha Candy Platform
```

## Шаг 2: Запустить тест

Во втором терминале (в той же папке):

```bash
node test-marketplace-listing.js
```

## Шаг 3: Наблюдать результаты

Тест должен:
1. ✅ Создать Auction House marketplace
2. ✅ Выставить NFT Bob на продажу за 0.5 SOL
3. ✅ Показать адреса и ссылки на Explorer

## Ожидаемый вывод:

```
🎯 Testing Marketplace Listing
==================================================
🏪 Creating Auction House marketplace...
✅ Marketplace created successfully!
📍 Auction House Address: ...

🏷️ Listing Bob's NFT for sale...
✅ NFT listed successfully!
📋 Listing Details:
   Listing Address: ...
   Price: 0.5 SOL

📊 Getting active listings...
✅ Found 1 active listing(s)
```

## Если сервер не запускается

Убедитесь что файл `.env` создан:
```bash
Copy-Item env.example .env
```

И что в нем есть `SOLANA_PRIVATE_KEY`

## Что тестируется:

- ✅ Создание Auction House (маркетплейс)
- ✅ Листинг NFT Bob за 0.5 SOL
- ✅ NFT остается у Bob до продажи (escrow-less)
- ✅ Получение списка активных листингов


# Test script for Etcha Candy Backend API
# Run with: powershell -ExecutionPolicy Bypass -File test-api.ps1

$API_BASE = 'http://localhost:3000/api'

Write-Host "🧪 Testing Etcha Candy Backend API..." -ForegroundColor Green
Write-Host ""

try {
    # Test 1: Health check
    Write-Host "1. Testing health check..." -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health check: $($healthResponse.message)" -ForegroundColor Green
    Write-Host "   Platform: $($healthResponse.config.platform)" -ForegroundColor Cyan
    Write-Host "   Network: $($healthResponse.config.network)" -ForegroundColor Cyan
    Write-Host ""

    # Test 2: Create a collection
    Write-Host "2. Testing collection creation..." -ForegroundColor Yellow
    $collectionData = @{
        eventCreator = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
        eventCreatorName = "Test Event Organizer"
        name = "Test Concert Collection"
        description = "NFT tickets for Test Concert 2024"
        eventName = "Test Concert 2024"
        eventDate = "2024-12-31"
        eventLocation = "Test Arena"
        ticketPrice = 0.1
        maxTickets = 100
        imageUrl = "https://example.com/concert.jpg"
    } | ConvertTo-Json

    $createResponse = Invoke-RestMethod -Uri "$API_BASE/collections" -Method POST -Body $collectionData -ContentType "application/json"
    
    if ($createResponse.success) {
        Write-Host "✅ Collection created: $($createResponse.data.name)" -ForegroundColor Green
        Write-Host "   ID: $($createResponse.data.id)" -ForegroundColor Cyan
        $collectionId = $createResponse.data.id
        Write-Host ""

        # Test 3: Get collections
        Write-Host "3. Testing get collections..." -ForegroundColor Yellow
        $getResponse = Invoke-RestMethod -Uri "$API_BASE/collections" -Method GET
        Write-Host "✅ Collections retrieved: $($getResponse.data.Count) collections" -ForegroundColor Green
        Write-Host ""

        # Test 4: Create Candy Machine
        Write-Host "4. Testing Candy Machine creation..." -ForegroundColor Yellow
        $cmResponse = Invoke-RestMethod -Uri "$API_BASE/collections/$collectionId/candy-machine" -Method POST
        
        if ($cmResponse.success) {
            Write-Host "✅ Candy Machine created: $($cmResponse.data.candyMachineAddress)" -ForegroundColor Green
            Write-Host ""

            # Test 5: Mint ticket
            Write-Host "5. Testing ticket minting..." -ForegroundColor Yellow
            $mintData = @{
                collectionId = $collectionId
                userWallet = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
                quantity = 1
            } | ConvertTo-Json

            $mintResponse = Invoke-RestMethod -Uri "$API_BASE/tickets/mint" -Method POST -Body $mintData -ContentType "application/json"
            
            if ($mintResponse.success) {
                Write-Host "✅ Ticket minted: $($mintResponse.data.mintedNfts[0])" -ForegroundColor Green
                Write-Host "   Quantity: $($mintResponse.data.quantity)" -ForegroundColor Cyan
                Write-Host ""

                # Test 6: Get user tickets
                Write-Host "6. Testing get user tickets..." -ForegroundColor Yellow
                $userTicketsResponse = Invoke-RestMethod -Uri "$API_BASE/tickets/user/$($mintData.userWallet)" -Method GET
                Write-Host "✅ User tickets retrieved: $($userTicketsResponse.data.tickets.Count) tickets" -ForegroundColor Green
                Write-Host ""

                # Test 7: Validate ticket
                Write-Host "7. Testing ticket validation..." -ForegroundColor Yellow
                $validateData = @{
                    mintAddress = $mintResponse.data.mintedNfts[0]
                    collectionId = $collectionId
                } | ConvertTo-Json

                $validateResponse = Invoke-RestMethod -Uri "$API_BASE/tickets/validate" -Method POST -Body $validateData -ContentType "application/json"
                Write-Host "✅ Ticket validation: $(if ($validateResponse.data.isValid) { 'Valid' } else { 'Invalid' })" -ForegroundColor Green
                Write-Host "   Event: $($validateResponse.data.collection.eventName)" -ForegroundColor Cyan
            } else {
                Write-Host "❌ Ticket minting failed: $($mintResponse.error)" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Candy Machine creation failed: $($cmResponse.error)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Collection creation failed: $($createResponse.error)" -ForegroundColor Red
    }

} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the server is running on http://localhost:3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 API testing completed!" -ForegroundColor Green

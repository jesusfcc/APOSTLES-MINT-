# 🎬 DEMO MODE - Testing Guide

The Jesus Mintt app is now in **DEMO MODE** so you can test all features without needing a wallet or contract address!

## How to Test

### 1. Start the Server (if not running)
```bash
cd /Users/mac/.gemini/antigravity/scratch/jesus_mintt
python3 -m http.server 8000
```

### 2. Open in Browser
Navigate to: **http://localhost:8000**

## What You'll See

### ✅ Splash Screen (Auto-plays)
- Shows "tHe AposTLes" pixel art
- Auto-transitions to mint page after 2.5 seconds

### ✅ Mint Page
- **Carousel**: Click left/right arrows to browse NFTs
- **Quantity**: Use +/- buttons to select amount (1-10)
- **Remaining**: Shows 2525 available
- **Price**: 12 Silver coins = 0.004207 ETH each
- **Wallet Button**: Yellow button (top-right) - not needed in demo mode
- **MINT NOW**: Click to start mint simulation

### ✅ Minting State
- Shows pixel art with "Minting..." text
- Simulates 2-4  second transaction time
- 90% chance of success, 10% chance of failure (random)

### ✅ Success State
- Shows the NFT you minted
- Random token ID (e.g., "The Apostle #4521")
- **Share on Farcaster** button (UI only)
- **Mint Another** button (returns to mint page)
- **Back arrow** (top-left, returns to mint page)

### ✅ Failure State
- Shows "Minting failed" in red
- Red retry button
- Click retry to return to mint page

## Testing Checklist

- [ ] Splash screen appears and auto-transitions
- [ ] Can browse NFTs with carousel arrows
- [ ] Can increase/decrease quantity
- [ ] Can click "MINT NOW" without wallet
- [ ] Minting screen appears with loading animation
- [ ] Success screen shows after minting
- [ ] Can see random token ID
- [ ] Can click "Mint Another" to return
- [ ] Can retry after a failure (if you get one)

## When Ready for Production

1. Open `app.js`
2. Find line 13: `DEMO_MODE: true,`
3. Change to: `DEMO_MODE: false,`
4. Add your contract address on line 10
5. Users will now need wallets to mint!

## Current Status

🎬 **DEMO MODE ACTIVE** - Full flow working without wallet/contract
- No wallet needed to test
- Simulated transactions
- All screens functional
- Safe to click around and explore!

---

**Location:** `/Users/mac/.gemini/antigravity/scratch/jesus_mintt/`

**Server:** Running on http://localhost:8000

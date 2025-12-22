# Jesus Mintt - The Apostles NFT Minting App

A premium Web3 minting application for "tHe AposTLes" NFT collection on Base blockchain.

## 🎨 Features

- **Splash Screen**: Beautiful pixel art Last Supper intro
- **Interactive Card Carousel**: Swipeable NFT preview with 3D transforms
- **Wallet Integration**: MetaMask/Web3 wallet connection with Base network auto-switching
- **Dynamic Minting**: Quantity selection with real-time price calculation
- **State Management**: Loading, success, and failure states
- **Responsive Design**: Mobile-first design with premium animations

## 📁 Project Structure

```
jesus_mintt/
├── .well-known/
│   └── farcaster.json  # Manifest file
├── css/
│   └── style.css       # Premium CSS styling
├── docs/               # Documentation
│   ├── DEMO_GUIDE.md
│   └── QUICK_START.md
├── images/             # Generated NFT cards & backgrounds
│   ├── apostle-1.png
│   ├── apostle-2.png
│   ├── apostle-3.png
│   ├── apostles-pixel.png
│   └── bg-renaissance.png
├── js/
│   └── app.js          # Web3 logic & state management
├── assets/             # Original reference screenshots
└── index.html          # Main HTML structure
```

## 🚀 Getting Started

### Prerequisites
- Python 3 (for local server)
- MetaMask or any Web3 wallet
- Base network configured in wallet

### Running Locally

1. Navigate to project directory:
```bash
cd /Users/mac/.gemini/antigravity/scratch/jesus_mintt
```

2. Start local server:
```bash
python3 -m http.server 8000
```

3. Open browser:
```
http://localhost:8000
```

## ⚙️ Configuration

Update the contract address in `app.js`:

```javascript
const CONFIG = {
    CHAIN_ID: '0x14a34', // Base Sepolia (84532)
    MINT_PRICE: '0.00000335', // ETH per mint
    CONTRACT_ADDRESS: '0x70CF7B20BCDE6f58faAbb9974CCaC000C1774D4d',
    INITIAL_REMAINING: 2525,
};
```

### Steps to Deploy:

1. **Deploy your NFT contract** to Base Sepolia
2. **Update `CONTRACT_ADDRESS`** in `app.js` (line 11)
3. **Update `encodeMintData()`** function to properly encode your contract's mint function if needed
4. **Test on Base Sepolia testnet**
5. **Deploy to hosting** (Vercel, Netlify, GitHub Pages, etc.)

## 🎯 User Flow

1. **Splash Screen** (2.5s auto-transition)
   - Shows "tHe AposTLes" pixel art logo

2. **Mint Page**
   - Connect wallet (top-right yellow button)
   - Browse NFTs with carousel arrows
   - Select quantity (1-10)
   - View remaining supply
   - Click "MINT NOW"

3. **Minting State**
   - Shows loading animation
   - Processing transaction

4. **Success/Failure**
   - **Success**: Displays minted NFT with token ID, share option
   - **Failure**: Shows retry button (common: insufficient balance)

## 💰 Pricing

- **Fixed Price**: `0.00000335 ETH` per NFT
- User can mint 1-10 NFTs per transaction

## 🌐 Base Network Settings

- **Chain ID**: 84532 (0x14a34)
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH

The app will automatically prompt users to switch to Base if they're on a different network.

## 🎨 Design Notes

- **Fonts**: Cinzel (titles), Inter (body)
- **Colors**: Gold (#FFD700), Dark backgrounds
- **Animations**: Smooth 3D carousel, fade-ins, pulse effects
- **Responsive**: Optimized for mobile and desktop

## 📝 Next Steps

1. ✅ Update contract address
2. ✅ Test on Base testnet
3. ✅ Deploy to production hosting
4. ✅ Share on Farcaster integration (optional)
5. ✅ Update remaining supply from contract events

## 🔧 Customization

### Adding More Apostle Cards

Add images to `/images/` and update HTML:

```html
<div class="card" data-index="3">
    <img src="images/apostle-4.png" alt="Apostle 4">
</div>
```

### Changing Mint Price

Update in `app.js`:

```javascript
MINT_PRICE: '0.004207', // Your price in ETH
```

### Modifying Success Description

Edit in `index.html`:

```html
<p class="success-description" id="success-description">
    Your custom description here...
</p>
```

## ⚠️ Important Notes

- The current contract address is a **placeholder**
- The `encodeMintData()` function is simplified - use ethers.js/web3.js for production
- Token IDs in success screen are currently simulated
- "Share on Farcaster" button is UI-only (add Farcaster SDK for functionality)

## 📄 License

All rights reserved.

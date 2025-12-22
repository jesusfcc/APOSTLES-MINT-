# tHe AposTLes - Farcaster Mini App

A Farcaster Mini App for minting Apostle NFTs on Base Sepolia.

## 🚀 Deployment

**Live URL:** https://the-apostles-seven.vercel.app

## 📱 Farcaster Integration

This app is configured as a Farcaster Mini App with:

- **FID:** 2855
- **Manifest:** `/.well-known/farcaster.json`
- **Farcaster SDK:** Integrated for seamless wallet connection and transactions

## ✨ Features

- **Splash Screen** - Beautiful intro with "tHe AposTLes" branding
- **NFT Carousel** - Browse different Apostle variations
- **Wallet Connection** - MetaMask or Farcaster wallet support
- **Quantity Selection** - Mint 1-10 NFTs at once
- **Transaction Flow** - Minting → Success/Failed states
- **Responsive Design** - Works on mobile and desktop

## 🔧 Configuration

The app supports both Farcaster and standalone browser modes:

### Farcaster Context
- Automatically detects when running in Farcaster
- Uses Farcaster SDK for wallet operations
- Auto-connects user's Farcaster wallet

### Browser Mode
- Falls back to standard Web3 wallet (MetaMask)
- Full wallet connection flow
- Network switching to Base Sepolia

## 📁 Project Structure

```
APOSTLE MINT/
├── .well-known/
│   └── farcaster.json    # Farcaster manifest
├── css/
│   └── style.css         # Styles
├── images/               # NFT images and assets
├── js/
│   └── app.js           # Main application logic
├── index.html           # Entry point
└── vercel.json          # Vercel deployment config
```

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Web3:** MetaMask / Farcaster SDK
- **Blockchain:** Base Sepolia (Chain ID: 84532)
- **Deployment:** Vercel
- **Integration:** Farcaster Mini App SDK v0.1.1

## 🎯 Smart Contract

- **Network:** Base Sepolia
- **Contract Address:** `0x70CF7B20BCDE6f58faAbb9974CCaC000C1774D4d`
- **Mint Price:** 0.00000335 ETH
- **Max Supply:** 10,000

## 📝 Farcaster Manifest

The manifest is properly configured at:
- **URL:** `https://the-apostles-seven.vercel.app/.well-known/farcaster.json`
- **Account Association:** FID 2855
- **Frame Version:** 1

## 🔍 Testing

### Browser Testing
1. Visit: https://the-apostles-seven.vercel.app
2. Connect MetaMask wallet
3. Switch to Base Sepolia network
4. Mint NFTs

### Farcaster Testing
1. Share the app URL in Farcaster
2. Launch as Mini App
3. Wallet auto-connects with Farcaster user
4. Seamless minting experience

## 🚦 Deployment Status

All changes are automatically deployed to Vercel when pushed to the `main` branch.

**Repository:** https://github.com/0xAzeez/THE-APOSTLES-

---

Built with ❤️ for the Farcaster community

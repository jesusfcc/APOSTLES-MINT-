# ✅ JESUS MINTT - READY TO TEST!

## 🎬 Demo Mode is ACTIVE

The app now works **WITHOUT needing a wallet** for testing!

## Quick Start

### Server is Running
The server is already running on: **http://localhost:8000**

### How to Test

1. **Open your browser** (Chrome, Safari, Firefox, etc.)

2. **Navigate to:** 
   ```
   http://localhost:8000
   ```
   **OR**
   ```
   localhost:8000
   ```

3. **You should see:**
   - ✅ **Splash Screen** first (black background)
   - The pixel art "Last Supper" image  
   - "tHe AposTLes" title
   - Auto-transitions to mint page after 2.5 seconds

4. **On the Mint Page:**
   - 🎬 **"DEMO MODE"** badge in top-right corner
   - NO wallet button (hidden in demo mode!)
   - Card carousel with NFT previews
   - Info panel with Remaining/Price/Quantity
   - Yellow **"MINT NOW"** button

5. **Click "MINT NOW"**
   - No wallet popup!
   - See "Minting..." screen for 2-4 seconds
   - 90% chance -> Success screen with your NFT
   - 10% chance -> Failure screen (click retry button)

## Troubleshooting

### If you don't see the splash screen:
1. **Hard refresh** the page:
   - **Mac**: `Cmd + Shift + R`
   - **Windows**: `Ctrl + Shift + R`
   
2. **Clear browser cache** or try **Incognito/Private mode**

3. **Check the browser console** (F12 or Right-click > Inspect > Console)
   - You should see: "🎬 DEMO MODE ACTIVE - No wallet needed!"

### If images don't load:
- Make sure you're accessing `http://localhost:8000` (not just opening the file)
- Check the terminal - server should say "Serving HTTP on :: port 8000"

## What Works in Demo Mode

✅ All screens (splash, mint, minting, success, failure)  
✅ Card carousel (left/right arrows)  
✅ Quantity controls (+/-)  
✅ Minting simulation (no wallet needed!)  
✅ Success screen with random token ID  
✅ Failure screen with retry  
✅ "Mint Another" and "Back" buttons  

## When Ready for Real Minting

1. Open `app.js`
2. Line 13: Change `DEMO_MODE: true,` to `DEMO_MODE: false,`
3. Line 10: Add your contract address
4. Users will now need wallets to mint!

## Server Commands

**Restart server:**
```bash
# Stop current server (Ctrl+C in terminal)
cd /Users/mac/.gemini/antigravity/scratch/jesus_mintt
python3 -m http.server 8000
```

**Check if running:**
Server should show: `Serving HTTP on :: port 8000 (http://[::]:8000/) ...`

---

🚀 **The app is ready! Open http://localhost:8000 in your browser!**

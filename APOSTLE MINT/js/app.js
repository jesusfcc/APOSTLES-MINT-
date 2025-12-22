// ===========================
// Configuration
// ===========================
const CONFIG = {
    CHAIN_ID: '0x14a34', // Base Sepolia (84532)
    CHAIN_NAME: 'Base Sepolia',
    RPC_URL: 'https://sepolia.base.org',
    EXPLORER_URL: 'https://sepolia.basescan.org',
    MINT_PRICE: '0', // 0 ETH (Free mint)
    CONTRACT_ADDRESS: '0x70CF7B20BCDE6f58faAbb9974CCaC000C1774D4d',
    MAX_SUPPLY: 10000,
    INITIAL_REMAINING: 2525,
    DEMO_MODE: false, // Set to false for real contract interaction
};

// ===========================
// Farcaster SDK
// ===========================
let farcasterSDK = null;
let isFarcasterContext = false;
let farcasterUser = null;

// ===========================
// State Management
// ===========================
const state = {
    currentScreen: 'splash',
    walletConnected: false,
    walletAddress: null,
    currentCardIndex: 1,
    quantity: 1,
    remaining: CONFIG.INITIAL_REMAINING,
    mintedTokenId: null,
    mintedImage: null,
};

// ===========================
// Helper: Visible Error (for mobile debugging)
// ===========================
function showVisibleError(title, message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 30px;
        border-radius: 12px;
        z-index: 99999;
        max-width: 80%;
        text-align: center;
        font-family: Inter, sans-serif;
    `;
    errorDiv.innerHTML = `
        <h3 style="color: #ff4444; margin: 0 0 15px 0; font-size: 18px;">${title}</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
        ">OK</button>
    `;
    document.body.appendChild(errorDiv);
}


// ===========================
// DOM Elements
// ===========================
const screens = {
    splash: document.getElementById('splash-screen'),
    mint: document.getElementById('mint-screen'),
    minting: document.getElementById('minting-screen'),
    failed: document.getElementById('failed-screen'),
    success: document.getElementById('success-screen'),
};

const elements = {
    walletBtn: document.getElementById('wallet-btn'),
    mintBtn: document.getElementById('mint-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    qtyMinus: document.getElementById('qty-minus'),
    qtyPlus: document.getElementById('qty-plus'),
    quantityDisplay: document.getElementById('quantity'),
    remainingDisplay: document.getElementById('remaining'),
    retryBtn: document.getElementById('retry-btn'),
    backBtn: document.getElementById('back-btn'),
    mintAnotherBtn: document.getElementById('mint-another-btn'),
    cards: document.querySelectorAll('.card'),
    mintedImage: document.getElementById('minted-image'),
    successTitle: document.getElementById('success-title'),
    successDescription: document.getElementById('success-description'),
    shareBtn: document.querySelector('.share-btn'), // Share button
};

// ===========================
// Screen Navigation
// ===========================
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
    state.currentScreen = screenName;
}

// ===========================
// Initialization
// ===========================
async function init() {
    console.log('🚀 App init started');

    // Show our app's splash for 1.5 seconds, then transition to mint
    // This runs independently of SDK initialization
    setTimeout(() => {
        console.log('⏰ Timeout fired, showing mint screen');
        showScreen('mint');
    }, 1500);

    // Initialize Farcaster SDK (this can take time, don't block splash transition)
    initializeFarcasterSDK().catch(err => {
        console.error('SDK init error:', err);
    });

    // Event Listeners
    elements.walletBtn.addEventListener('click', handleWalletClick);
    elements.mintBtn.addEventListener('click', handleMint);
    elements.prevBtn.addEventListener('click', () => navigateCarousel(-1));
    elements.nextBtn.addEventListener('click', () => navigateCarousel(1));
    elements.qtyMinus.addEventListener('click', () => updateQuantity(-1));
    elements.qtyPlus.addEventListener('click', () => updateQuantity(1));
    elements.retryBtn.addEventListener('click', retryMint);
    elements.backBtn.addEventListener('click', () => showScreen('mint'));
    elements.mintAnotherBtn.addEventListener('click', () => showScreen('mint'));
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', handleShare);
    }


    // DEMO MODE adjustments
    if (CONFIG.DEMO_MODE) {
        // Hide wallet button in demo mode
        elements.walletBtn.style.display = 'none';

        // Add demo badge
        const demoBadge = document.createElement('div');
        demoBadge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 193, 7, 0.9);
            color: #000;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        demoBadge.textContent = '🎬 DEMO MODE';
        document.body.appendChild(demoBadge);

        console.log('🎬 DEMO MODE ACTIVE - No wallet needed!');
    } else {
        // Check if wallet is already connected in production mode
        // If in Farcaster context, we'll wait for SDK init to handle wallet
        // If NOT in Farcaster context after init, checkWalletConnection() will be called below
        if (!isFarcasterContext) {
            checkWalletConnection();
        }
    }

    // Update displays
    updateDisplays();
}

// ===========================
// Farcaster SDK Initialization
// ===========================

// Note: sdk.actions.ready() is called in index.html before this script loads
// We just need to re-use the SDK reference for other operations

async function initializeFarcasterSDK() {
    try {
        // Check for SDK set by index.html (via window.farcasterSdk)
        if (typeof window.farcasterSdk !== 'undefined') {
            farcasterSDK = window.farcasterSdk;
            console.log('✅ Farcaster SDK found (window.farcasterSdk)');

            // Get context
            const context = await farcasterSDK.context;

            if (context) {
                isFarcasterContext = true;
                farcasterUser = context.user;
                console.log('🟣 Running in Farcaster context');

                // Attempt direct wallet connection via SDK provider
                await connectWallet();
            } else {
                console.log('🌐 No Farcaster context - browser mode');
                checkWalletConnection();
            }
        }
        // Fallback: Check for 'miniapp' global (per npm docs)
        else if (typeof miniapp !== 'undefined' && miniapp.sdk) {
            farcasterSDK = miniapp.sdk;
            console.log('✅ Farcaster SDK found (miniapp global)');
            try { farcasterSDK.actions.ready(); } catch (e) { }

            const context = await farcasterSDK.context;
            if (context) {
                isFarcasterContext = true;
                farcasterUser = context.user;
                await connectWallet();
            } else {
                checkWalletConnection();
            }
        }
        // Legacy fallback
        else if (typeof window.sdk !== 'undefined') {
            farcasterSDK = window.sdk;
            console.log('✅ Farcaster SDK found (window.sdk)');
            try { farcasterSDK.actions.ready(); } catch (e) { }

            const context = await farcasterSDK.context;
            if (context) {
                isFarcasterContext = true;
                farcasterUser = context.user;
                await connectWallet();
            } else {
                checkWalletConnection();
            }
        }
        else {
            console.log('🌐 Farcaster SDK not found - running in browser mode');
            checkWalletConnection();
        }
    } catch (error) {
        console.error('Error initializing Farcaster SDK:', error);
        checkWalletConnection();
    }
}

// ===========================
// Wallet Connection
// ===========================
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            if (accounts.length > 0) {
                state.walletConnected = true;
                state.walletAddress = accounts[0];
                updateWalletButton();
            }
        } catch (error) {
            console.error('Error checking wallet:', error);
        }
    }
}

async function connectWallet() {
    // If in Farcaster context, use Farcaster wallet provider
    if (isFarcasterContext && farcasterSDK && farcasterSDK.wallet && farcasterSDK.wallet.ethProvider) {
        try {
            console.log('🔌 Connecting via Farcaster SDK (ethProvider)...');
            const provider = farcasterSDK.wallet.ethProvider;

            // Request accounts explicitly
            const accounts = await provider.request({
                method: 'eth_requestAccounts'
            });

            if (accounts && accounts.length > 0) {
                state.walletConnected = true;
                state.walletAddress = accounts[0];
                updateWalletButton();
                console.log('✅ Farcaster wallet connected:', state.walletAddress);
                return;
            }
        } catch (error) {
            console.error('❌ Error connecting Farcaster wallet:', error);
        }
    }

    // Regular MetaMask/Web3 wallet connection (Browser Mode)
    if (!isFarcasterContext && typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Check/switch to Base network
            await switchToBase();

            state.walletConnected = true;
            state.walletAddress = accounts[0];
            updateWalletButton();

            console.log('Wallet connected:', state.walletAddress);
        } catch (error) {
            console.error('Error connecting wallet:', error);
            // alert('Failed to connect wallet. Please try again.');
        }
    } else if (!isFarcasterContext) {
        // Only show alert if user clicked button, not on auto-connect
        // We can check if this was triggered by a user event if needed, but for now simple check
        console.log('No wallet provider found');
    }
}

function disconnectWallet() {
    if (confirm('Disconnect wallet?')) {
        state.walletConnected = false;
        state.walletAddress = null;
        updateWalletButton();
        console.log('Wallet disconnected by user');
    }
}

async function handleWalletClick() {
    if (state.walletConnected) {
        disconnectWallet();
    } else {
        await connectWallet();
    }
}

async function switchToBase() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONFIG.CHAIN_ID }],
        });
    } catch (switchError) {
        // If Base is not added, add it
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: CONFIG.CHAIN_ID,
                        chainName: CONFIG.CHAIN_NAME,
                        rpcUrls: [CONFIG.RPC_URL],
                        blockExplorerUrls: [CONFIG.EXPLORER_URL],
                        nativeCurrency: {
                            name: 'Ethereum',
                            symbol: 'ETH',
                            decimals: 18,
                        },
                    }],
                });
            } catch (addError) {
                throw new Error('Failed to add Base network');
            }
        } else {
            throw switchError;
        }
    }
}

function updateWalletButton() {
    if (state.walletConnected) {
        elements.walletBtn.classList.add('connected');
        const shortAddress = `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`;
        elements.walletBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M3 10h18" stroke="currentColor" stroke-width="2"/>
                <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
            </svg>
            ${shortAddress}
        `;
    } else {
        elements.walletBtn.classList.remove('connected');
        elements.walletBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M3 10h18" stroke="currentColor" stroke-width="2"/>
                <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
            </svg>
        `;
    }
}

// ===========================
// Carousel Navigation
// ===========================
function navigateCarousel(direction) {
    const totalCards = elements.cards.length;
    state.currentCardIndex = (state.currentCardIndex + direction + totalCards) % totalCards;
    updateCarousel();
}

function updateCarousel() {
    elements.cards.forEach((card, index) => {
        card.classList.toggle('active', index === state.currentCardIndex);
    });
}

// ===========================
// Quantity Controls
// ===========================
function updateQuantity(delta) {
    const newQuantity = state.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 5) {
        state.quantity = newQuantity;
        updateDisplays();
    }
}

function updateDisplays() {
    elements.quantityDisplay.textContent = state.quantity;
    elements.remainingDisplay.textContent = state.remaining;
}

// ===========================
// Minting Logic
// ===========================
async function handleMint() {
    console.log('🎯 MINT BUTTON CLICKED');

    // DEMO MODE - Simulate minting without wallet
    if (CONFIG.DEMO_MODE) {
        console.log('🎬 DEMO MODE: Simulating mint transaction');
        showScreen('minting');

        const mintTime = 2000 + Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, mintTime));

        if (Math.random() > 0.1) {
            handleMintSuccess('demo_tx_hash_' + Date.now());
        } else {
            handleMintFailure({ message: 'Demo: Simulated failure' });
        }
        return;
    }

    // PRODUCTION MODE - Real wallet transaction
    try {
        console.log('💼 Checking wallet connection...');
        console.log('Wallet connected:', state.walletConnected);
        console.log('Wallet address:', state.walletAddress);

        // Check wallet connection
        if (!state.walletConnected) {
            console.log('⚠️ Wallet not connected, attempting to connect...');
            await connectWallet();
            if (!state.walletConnected) {
                throw new Error('Wallet connection failed');
            }
        }

        console.log('✅ Wallet check passed');

        // Show minting screen
        showScreen('minting');
        console.log('📺 Showing minting screen');

        // Show immediate status to user
        setTimeout(() => {
            showVisibleError('Status', 'Preparing transaction...');
        }, 500);

    } catch (error) {
        console.error('❌ Error in handleMint (before transaction):', error);
        showVisibleError('Wallet Check Failed', error.message || 'Could not verify wallet connection');
        handleMintFailure(error);
        return;
    }

    // Wrap transaction in timeout
    const transactionPromise = (async () => {
        // Calculate total cost
        const totalCost = (parseFloat(CONFIG.MINT_PRICE) * state.quantity).toFixed(6);
        const totalCostWei = '0x' + (parseFloat(totalCost) * 1e18).toString(16);

        // Prepare Transaction Data
        console.log('🔧 Encoding transaction data...');
        let txData;
        try {
            txData = encodeMintData(state.quantity);
            console.log('✅ Encoding successful');
        } catch (encodeError) {
            console.error('❌ Encoding failed:', encodeError);
            showVisibleError('Encoding Failed', `Cannot prepare transaction: ${encodeError.message}`);
            throw encodeError;
        }

        // Transaction Object
        const transactionParameters = {
            to: CONFIG.CONTRACT_ADDRESS,
            from: state.walletAddress,
            value: totalCostWei,
            data: txData,
            chainId: CONFIG.CHAIN_ID
        };

        // Select Provider (Farcaster vs Window)
        let requester;
        if (isFarcasterContext && farcasterSDK && farcasterSDK.wallet && farcasterSDK.wallet.ethProvider) {
            requester = farcasterSDK.wallet.ethProvider;
            console.log('Using Farcaster provider');
        } else {
            requester = window.ethereum;
            console.log('Using window.ethereum');
        }

        // Send Transaction
        console.log('Sending transaction...');
        let txHash;
        try {
            txHash = await requester.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            console.log('✅ Transaction sent successfully!');
        } catch (txError) {
            console.error('❌ eth_sendTransaction failed:', txError);
            showVisibleError('Send Failed', `Could not send transaction: ${txError.message || 'Unknown error'}`);
            throw txError;
        }

        console.log('Transaction hash:', txHash);
        showVisibleError('Transaction Submitted!', `TX Hash: ${txHash}\n\nCheck on BaseScan Sepolia to confirm.`);

        // Poll for receipt
        let receipt = null;
        let attempts = 0;
        const maxAttempts = 30;

        while (!receipt && attempts < maxAttempts) {
            try {
                const checkProvider = isFarcasterContext && farcasterSDK && farcasterSDK.wallet && farcasterSDK.wallet.ethProvider
                    ? farcasterSDK.wallet.ethProvider
                    : window.ethereum;

                receipt = await checkProvider.request({
                    method: 'eth_getTransactionReceipt',
                    params: [txHash]
                });

                if (receipt) {
                    console.log('✅ Transaction confirmed!', receipt);
                    break;
                }
            } catch (e) {
                console.log('Polling...', attempts);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }

        if (!receipt) {
            console.log('⚠️ Timeout waiting for confirmation, but transaction was submitted');
        }

        handleMintSuccess(txHash);
    })();

    // Add 60 second timeout
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Transaction timeout after 60 seconds')), 60000);
    });

    try {
        await Promise.race([transactionPromise, timeoutPromise]);
    } catch (timeoutError) {
        console.error('❌ Timeout or error:', timeoutError);
        showVisibleError('Timeout', timeoutError.message || 'Transaction took too long');
        handleMintFailure(timeoutError);
    }
}

function encodeMintData(quantity) {
    console.log('🔧 encodeMintData called with quantity:', quantity);

    // Check for ethers in multiple scopes
    let eth;
    if (typeof window.ethers !== 'undefined') {
        eth = window.ethers;
        console.log('✅ Using window.ethers');
    } else if (typeof ethers !== 'undefined') {
        eth = ethers;
        console.log('✅ Using global ethers');
    } else {
        const errorMsg = '❌ CRITICAL: Ethers.js not loaded! Cannot encode transaction.';
        console.error(errorMsg);
        showVisibleError('Ethers.js Missing', 'Library failed to load. Please refresh the app.');
        throw new Error(errorMsg);
    }

    try {
        // ABI for Thirdweb Drop claim function
        const abi = [
            "function claim(address _receiver, uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) _allowlistProof, bytes _data) external payable"
        ];

        const iface = new eth.utils.Interface(abi);

        // Parameters for claim
        const receiver = state.walletAddress;
        console.log('📍 Receiver:', receiver);

        // Use AddressZero because contract strictly compares with stored 0x0...
        const NATIVE_TOKEN = eth.constants.AddressZero;
        const currency = NATIVE_TOKEN;
        const pricePerToken = 0;

        const currencyInStruct = eth.constants.AddressZero;

        const allowlistProof = {
            proof: [],
            quantityLimitPerWallet: eth.constants.MaxUint256,
            pricePerToken: eth.constants.MaxUint256,
            currency: currencyInStruct
        };

        const data = '0x';

        console.log('📦 Encoding with params:', {
            receiver,
            quantity,
            currency,
            pricePerToken,
            allowlistProof
        });

        // Encode function call
        const encodedData = iface.encodeFunctionData("claim", [
            receiver,
            quantity,
            currency,
            pricePerToken,
            allowlistProof,
            data
        ]);

        console.log('✅ Encoded claim data:', encodedData);
        return encodedData;
    } catch (error) {
        console.error('❌ Error encoding claim data:', error);
        showVisibleError('Encoding Error', `Failed to prepare transaction: ${error.message}`);
        throw error; // Re-throw to stop mint process
    }
}

function handleMintSuccess(txHash) {
    // Update state
    state.remaining -= state.quantity;
    state.mintedTokenId = Math.floor(Math.random() * 10000) + 1; // Simulated

    // Get the current card image
    const currentCard = elements.cards[state.currentCardIndex];
    const imageSrc = currentCard.querySelector('img').src;
    state.mintedImage = imageSrc;

    // Update success screen
    elements.mintedImage.src = state.mintedImage;
    elements.successTitle.textContent = `The Apostle #${state.mintedTokenId}`;

    // Show success screen
    showScreen('success');

    // Update remaining count
    updateDisplays();

    // Reset quantity
    state.quantity = 1;
    elements.quantityDisplay.textContent = state.quantity;

    console.log('Mint successful! Token ID:', state.mintedTokenId);
}

function handleMintFailure(error) {
    showScreen('failed');

    // Log the error
    console.error('Mint failed:', error);

    // Common error messages
    if (error.code === 4001) {
        console.log('User rejected transaction');
    } else if (error.message && error.message.includes('insufficient funds')) {
        console.log('Insufficient funds');
    }
}

function retryMint() {
    showScreen('mint');
}

// ===========================
// Share Functionality
// ===========================
function handleShare() {
    const text = `I just minted Apostle #${state.mintedTokenId}! 🪙\n\nWitness the convergence of history and mythology on Base.\n\nMint yours now: https://the-apostles-seven.vercel.app`;
    const embedUrl = 'https://the-apostles-seven.vercel.app';

    // Construct Warpcast intent URL
    const intentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`;

    if (isFarcasterContext && farcasterSDK) {
        // Use SDK to open URL
        farcasterSDK.actions.openUrl(intentUrl);
    } else {
        // Fallback for browser
        window.open(intentUrl, '_blank');
    }
}

// ===========================
// Listen for wallet changes
// ===========================
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected wallet
            state.walletConnected = false;
            state.walletAddress = null;
            elements.walletBtn.classList.remove('connected');
            updateWalletButton();
        } else {
            state.walletAddress = accounts[0];
            updateWalletButton();
        }
    });

    window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload();
    });
}

// ===========================
// Start the app
// ===========================
init();

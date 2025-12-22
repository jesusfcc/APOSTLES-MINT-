"use client";

import React, { useState } from 'react';
import { TransactionButton, useActiveAccount, MediaRenderer, ThirdwebProvider } from "thirdweb/react";
import { defineChain, getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { client } from "@/lib/client";
import { createWallet } from "thirdweb/wallets";
import { useConnect } from "thirdweb/react";

// Configuration
const CHAIN = defineChain(84532); // Base Sepolia
const CONTRACT_ADDRESS = "0x70CF7B20BCDE6f58faAbb9974CCaC000C1774D4d";
const CONTRACT = getContract({
    client: client,
    chain: CHAIN,
    address: CONTRACT_ADDRESS,
});

const IMAGES = [
    "/images/cards/1.png",
    "/images/cards/2.png",
    "/images/cards/3.png",
    "/images/cards/4.png",
    "/images/cards/5.png",
    "/images/cards/6.png",
    "/images/cards/7.png",
    "/images/cards/8.png",
    "/images/cards/9.png"
];

export default function MintScreen({ context }: { context?: any }) {
    const account = useActiveAccount();
    const { connect } = useConnect();
    const [quantity, setQuantity] = useState(1);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Farcaster Wallet Connection
    React.useEffect(() => {
        if (!mounted || account) return;

        const connectFarcasterWallet = async () => {
            try {
                const { default: sdk } = await import("@farcaster/frame-sdk");
                if (sdk.wallet?.ethProvider) {
                    console.log("Connecting to Farcaster Wallet...");
                    const wallet = createWallet("io.metamask");
                    // @ts-ignore - Override with Farcaster provider
                    await wallet.connect({
                        client,
                        // @ts-ignore
                        provider: sdk.wallet.ethProvider
                    });

                    await connect(wallet);
                }
            } catch (error) {
                console.error("Error connecting to Farcaster wallet:", error);
            }
        };

        connectFarcasterWallet();
    }, [mounted, account, connect]);

    if (!mounted) return null; // Avoid hydration mismatch or SSR issues with wallet hooks


    // Carousel Navigation
    const navigateCarousel = (direction: number) => {
        setCurrentCardIndex((prev) =>
            (prev + direction + IMAGES.length) % IMAGES.length
        );
    };

    // Quantity Limits
    const updateQuantity = (delta: number) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= 5) setQuantity(newQty);
    };

    // Success Screen
    if (mintedTokenId) {
        return (
            <div className="screen success-screen active" id="success-screen">
                <button className="back-btn" onClick={() => setMintedTokenId(null)}>← Back</button>
                <div className="success-content">
                    {context?.user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            {context.user.pfpUrl && <img src={context.user.pfpUrl} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="pfp" />}
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>@{context.user.username}</span>
                        </div>
                    )}
                    <div className="success-card">
                        <img src={IMAGES[currentCardIndex]} alt="Minted Apostle" />
                    </div>
                    <div className="success-info">
                        <h2 className="success-title">The Apostle #{mintedTokenId.toString()}</h2>
                        <div className="success-description">
                            The wait is over. The prophecy is fulfilled.<br />
                            Your Apostle has descended.
                        </div>
                    </div>

                    <a
                        href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`I just minted Apostle #${mintedTokenId.toString()}! 🪙\n\nWitness the convergence of history and mythology on Base.`)}&embeds[]=${encodeURIComponent("https://the-apostles-h7q4.vercel.app")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn"
                        style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
                    >
                        Share on Warpcast
                    </a>

                    <button className="mint-another-btn" onClick={() => setMintedTokenId(null)}>
                        Mint Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen mint-screen active" id="mint-screen">
            {context?.user && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '20px', border: '1px solid var(--accent-primary)' }}>
                    {context.user.pfpUrl && <img src={context.user.pfpUrl} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="pfp" />}
                    <span style={{ fontSize: '12px', color: '#fff' }}>@{context.user.username}</span>
                </div>
            )}
            {/* Carousel */}
            <div className="carousel-container">
                <button className="carousel-btn prev" onClick={() => navigateCarousel(-1)}>←</button>
                <div className="cards-wrapper">
                    {IMAGES.map((src, index) => (
                        <div
                            key={index}
                            className={`card ${index === currentCardIndex ? 'active' : ''}`}
                            style={{ display: Math.abs(index - currentCardIndex) <= 1 ? 'block' : 'none' }} // Simple optimization
                        >
                            <img src={src} alt={`Apostle ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <button className="carousel-btn next" onClick={() => navigateCarousel(1)}>→</button>
            </div>

            {/* Info Panel */}
            <div className="info-panel">
                <div className="info-row">
                    <span className="info-label">Price</span>
                    <span className="info-value">FREE</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Quantity</span>
                    <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(-1)}>-</button>
                        <span className="qty-value">{quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(1)}>+</button>
                    </div>
                </div>
                <div className="info-row">
                    <span className="info-label">Total</span>
                    <span className="info-value">{(0 * quantity).toFixed(4)} ETH</span>
                </div>
            </div>

            {/* Thirdweb Transaction Button */}
            <TransactionButton
                transaction={() => {
                    if (!account) throw new Error("Connect wallet first");
                    return claimTo({
                        contract: CONTRACT,
                        to: account.address,
                        quantity: BigInt(quantity)
                    });
                }}
                onTransactionSent={(result) => {
                    console.log("Tx sent", result.transactionHash);
                }}
                onTransactionConfirmed={(receipt) => {
                    console.log("Tx confirmed", receipt);
                    // Simulate Token ID for now or parse logs if we want to be fancy
                    // receipt.logs...
                    setMintedTokenId(BigInt(Math.floor(Math.random() * 10000)));
                }}
                onError={(error) => {
                    console.error("Transaction failed", error);
                    alert(`Error: ${error.message}`);
                }}
                className="mint-btn" // Applies our CSS class
            >
                MINT APOSTLE
            </TransactionButton>
        </div>
    );
}

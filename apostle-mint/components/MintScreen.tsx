"use client";

import React, { useState } from 'react';
import { TransactionButton, useActiveAccount, MediaRenderer } from "thirdweb/react";
import { defineChain, getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { client } from "@/lib/client";

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

export default function MintScreen() {
    const account = useActiveAccount();
    const [quantity, setQuantity] = useState(1);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

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
                        href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`I just minted Apostle #${mintedTokenId.toString()}! 🪙\n\nWitness the convergence of history and mythology on Base.`)}&embeds[]=${encodeURIComponent("https://the-apostles-seven.vercel.app")}`}
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

"use client";

import Image from "next/image";

interface SuccessScreenProps {
  isVisible: boolean;
  onBack: () => void;
  onMintAnother: () => void;
  onShare: () => void;
  mintedImage?: string;
  tokenId?: number;
  description?: string;
}

/**
 * SuccessScreen component - Shown after successful mint
 */
export function SuccessScreen({
  isVisible,
  onBack,
  onMintAnother,
  onShare,
  mintedImage = "/assets/apostle-2.png",
  tokenId = 2158,
  description = "Witness the convergence of history, mythology, and the divine. From the humble Apostles walking the earth to the thunderous Gods of Olympus",
}: SuccessScreenProps) {
  if (!isVisible) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat animate-fade-in relative"
      style={{
        backgroundImage: "url('/assets/bg-image.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-8 pb-6 px-6 gap-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-white p-2 hover:-translate-x-1 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Success Card */}
        <div className="w-full max-w-[400px] mt-12">
          <div
            className="w-full aspect-[3/4] rounded-3xl overflow-hidden animate-scale-in"
            style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)" }}
          >
            <Image
              src={mintedImage}
              alt={`The Apostle #${tokenId}`}
              width={400}
              height={533}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Success Info */}
        <div className="w-full max-w-[500px] text-left">
          <h2 className="font-cinzel text-2xl font-bold text-white mb-4">
            The Apostle #{tokenId}
          </h2>
          <p className="text-gray-400 leading-relaxed">
            {description}
            <span className="text-gold font-semibold cursor-pointer ml-1">
              show more...
            </span>
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="w-full max-w-[500px] bg-gold text-black py-4 px-8 rounded-lg text-lg font-bold hover:bg-gold-bright transition-all"
          style={{ boxShadow: "0 6px 20px rgba(255, 215, 0, 0.4)" }}
        >
          Share On Farcaster
        </button>

        {/* Mint Another Button */}
        <button
          onClick={onMintAnother}
          className="w-full max-w-[500px] bg-transparent border-[3px] border-gold text-gold py-4 px-8 rounded-lg text-lg font-bold hover:bg-gold hover:text-black transition-all"
        >
          Mint Another
        </button>
      </div>
    </div>
  );
}

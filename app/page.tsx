"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ThirdwebProvider } from "thirdweb/react";

// Use dynamic imports to prevent SSR issues and initialization crashes
const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { ssr: false });
const MintScreen = dynamic(() => import("@/components/MintScreen"), { ssr: false });

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const load = async () => {
      console.log("Loading Farcaster SDK dynamically...");
      try {
        const { default: sdk } = await import("@farcaster/frame-sdk");
        const ctx = await sdk.context;
        setContext(ctx);
        await sdk.actions.ready();
        console.log("SDK Ready called successfully with context:", ctx);
      } catch (e) {
        console.error("Farcaster SDK initialization failed:", e);
      }
      setIsSDKLoaded(true);
    };

    load();
  }, [mounted]);

  // Initial render (SSR and first hydration)
  if (!mounted || !isSDKLoaded) {
    return <SplashScreen />;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <ThirdwebProvider>
        <MintScreen context={context} />
      </ThirdwebProvider>
    </main>
  );
}
// Trigger Vercel Build - Tue Dec 23 03:04:42 WAT 2025

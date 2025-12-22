"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MintScreen from "@/components/MintScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1.5s timer for splash
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <MintScreen />;
}

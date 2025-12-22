"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MintScreen from "@/components/MintScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1.5s timer for splash
    const timer = setTimeout(() => {
      console.log("Splash timeout finished");
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  console.log("Rendering Home, showSplash:", showSplash);


  if (showSplash) {
    return <SplashScreen />;
  }

  return <MintScreen />;
}

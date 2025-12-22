"use client";

import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MintScreen from "@/components/MintScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} ${msg}`]);
  };

  useEffect(() => {
    addLog("Mounting Home");
    // 1s timer for splash
    const timer = setTimeout(() => {
      addLog("Splash timeout finished");
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div style={{ display: showSplash ? 'block' : 'none' }}>
        <SplashScreen />
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: '#0f0', fontSize: '10px', height: '100px', overflow: 'auto', zIndex: 9999 }}>
          {logs.map((L, i) => <div key={i}>{L}</div>)}
        </div>
      </div>
      <div style={{ display: !showSplash ? 'block' : 'none' }}>
        <MintScreen />
      </div>
    </>
  );
}

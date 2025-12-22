"use client";

import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MintScreen from "@/components/MintScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]} ${msg}`]);
  };

  useEffect(() => {
    addLog("Home Mounted");
    const timer = setTimeout(() => {
      addLog("Timeout: Setting showSplash false");
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#000" }}>
      {/* Top persistent debug layer */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "80px",
        background: "rgba(0, 255, 0, 0.2)",
        color: "#0f0",
        zIndex: 10000,
        fontSize: "10px",
        overflowY: "auto",
        pointerEvents: "none",
        padding: "5px"
      }}>
        {logs.map((L, i) => <div key={i}>{L}</div>)}
      </div>

      {/* Manual Skip Button for Debugging */}
      {showSplash && (
        <button
          onClick={() => { addLog("Manual Skip Clicked"); setShowSplash(false); }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 10001,
            background: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            fontSize: "12px"
          }}
        >
          SKIP SPLASH
        </button>
      )}

      {/* Screens */}
      <div style={{ display: showSplash ? "block" : "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <SplashScreen />
      </div>

      <div style={{ display: !showSplash ? "block" : "none" }}>
        <MintScreen />
      </div>
    </main>
  );
}

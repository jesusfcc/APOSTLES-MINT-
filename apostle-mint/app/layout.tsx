import { ThirdwebProvider } from "thirdweb/react";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Apostles",
  description: "Mint your Apostle on Base Sepolia",
  other: {
    // Farcaster Frame Tags
    "fc:frame": "vNext",
    "fc:frame:image": "https://the-apostles-h7q4.vercel.app/images/splash.png",
    "fc:frame:button:1": "Mint Now",
    "fc:frame:action": "tx",
    "fc:frame:target": "https://the-apostles-h7q4.vercel.app/api/frame/mint",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="global-error-layer" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100000, color: 'red', background: 'white', display: 'none', padding: '10px', fontSize: '12px' }}></div>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.onerror = function(msg, url, line) {
            var el = document.getElementById("global-error-layer");
            if (el) {
              el.style.display = "block";
              el.innerText = "Global Error: " + msg + " at " + url + ":" + line;
            }
          };
          window.onunhandledrejection = function(event) {
            var el = document.getElementById("global-error-layer");
            if (el) {
              el.style.display = "block";
              el.innerText = "Unhandled Promise: " + event.reason;
            }
          };
        `}} />
        {children}
      </body>
    </html>
  );
}

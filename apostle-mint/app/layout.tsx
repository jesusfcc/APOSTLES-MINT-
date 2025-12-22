import { ThirdwebProvider } from "thirdweb/react";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Apostles",
  description: "Mint your Apostle on Base Sepolia",
  other: {
    // Farcaster Frame Tags
    "fc:frame": "vNext",
    "fc:frame:image": "https://the-apostles-seven.vercel.app/images/splash.png",
    "fc:frame:button:1": "Mint Now",
    "fc:frame:action": "tx",
    "fc:frame:target": "https://the-apostles-seven.vercel.app/api/frame/mint",
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
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}

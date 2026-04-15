import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FarmDirect — Buy Fresh, Direct from Farmers",
  description:
    "Discover local farmers, shop fresh produce, and negotiate prices directly. No middlemen, fair prices.",
  keywords: "farmers market, fresh produce, local food, organic vegetables, direct farm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="bg-amber-50 font-outfit antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1a3a1a",
                color: "#fff",
                borderRadius: "12px",
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

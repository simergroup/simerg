import "./globals.css";

import { roboto } from "../utils/fonts";
import Navigation from "../components/Navigation";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthProvider from "./context/AuthProvider";

export const metadata = {
  title: "SIMERG - SPORTS, INNOVATION, MANAGEMENT AND ESPORTS RESEARCH GROUP",
  description: "SIMERG - SPORTS, INNOVATION, MANAGEMENT AND ESPORTS RESEARCH GROUP",
};

export default function RootLayout({ children }) {
  return (
    <html className={roboto.className} lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/apple-touch-icon.png" sizes="any" />
        <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" />
        <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" />
      </head>
      <body className="md:flex-col md:flex md:h-dvh bg-neutral-900">
        <AuthProvider>
          <Navigation />
          <div className="flex items-center justify-center flex-1 max-w-screen-xl mx-auto">
            <Toaster position="bottom-right" />
            {children}
            <SpeedInsights />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

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

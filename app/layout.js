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
			<body className="bg-neutral-900 md:flex md:h-dvh md:flex-col">
				<AuthProvider>
					<Navigation />
					<div className="mx-auto flex max-w-screen-xl flex-1 items-center justify-center">
						<Toaster position="bottom-right" />
						{children}
						<SpeedInsights />
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}

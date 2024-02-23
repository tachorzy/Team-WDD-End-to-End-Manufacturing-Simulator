import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { interTightRegular } from "../utils/localNextFonts";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TensorIoT End-to-End Manufacturing Simulator",
    description: "We connect you to your devices to make them smarter.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${interTightRegular.className} scroll-smooth`}>
                {children}
            </body>
        </html>
    );
}

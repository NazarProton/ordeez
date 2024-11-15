import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/NavBar/Navbar';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/configs';
import Web3ModalProvider from '@/context';
import { GoogleTagManager } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'Ordeez.io',
  description: 'Ordeez Ordinals Marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config);
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-ZJB961H6XH"></GoogleTagManager>
      <body className="w-dvw h-dvh">
        <Web3ModalProvider initialState={initialState}>
          <Navbar>{children}</Navbar>
        </Web3ModalProvider>
      </body>
    </html>
  );
}

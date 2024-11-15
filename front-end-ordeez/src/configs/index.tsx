import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, sepolia } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
export const backBaseUrl = process.env.BACKEND_BASE_URL;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'Ordeez',
  description: 'Ordeez Ordinals Marketplace',
  url: 'https://ordeez.io',
  icons: ['../app/favicon.ico'],
};

const chains = [mainnet] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  // ...wagmiOptions, // Optional - Override createConfig parameters
});

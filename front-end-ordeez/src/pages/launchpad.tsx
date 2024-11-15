'use client'; // This is a client component
import PageUnderDevelopment from '@/components/PUDevelopment';
import '@/styles/globals.css';
import Head from 'next/head';

export default function Launchpad() {
  return (
    <>
      {/* <Head>
        <title>Ordeez</title>
        <meta name="description" content="Ordeez.io" />
      </Head> */}
      <main className="flex flex-col justify-between items-center mb-20 pc450:px-16 py-16 min-w-fit min-h-full">
        <PageUnderDevelopment />
      </main>
    </>
  );
}

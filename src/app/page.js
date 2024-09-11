import Head from 'next/head';
import Dashboard from './components/Dashboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>California Latino Dashboard</title>
        <meta name="description" content="The California Latino Dashboard by UCLA LPPI showcases climate change and health equity data for Latino neighborhoods in California." />
        <meta name="keywords" content="California Latino Dashboard, UCLA LPPI, climate change, health equity, Latino communities" />
        <meta name="author" content="UCLA Latino Policy and Politics Institute" />
        <meta property="og:title" content="California Latino Dashboard" />
        <meta property="og:description" content="The California Latino Dashboard by UCLA LPPI showcases climate change and health equity data for Latino neighborhoods in California." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ucla-lppi.github.io/dashboard" />
        <meta property="og:image" content="images/metadata.png" />
      </Head>
      <Dashboard />
    </>
  );
}
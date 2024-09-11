// pages/index.js
import { useRouter } from 'next/router';
import Dashboard from '@/app/components/Dashboard';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ];
}

export default function Home() {
  const router = useRouter();
  const { locale } = router.query;

  return (
    <div>
      <h1>{locale === 'es' ? 'Hola' : 'Hello'}</h1>
      <Dashboard />
    </div>
  );
}
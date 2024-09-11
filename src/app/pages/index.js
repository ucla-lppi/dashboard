// pages/index.js
import { useRouter } from 'next/router';
import Dashboard from '@/app/components/Dashboard';
import LocaleToggleButton from '@/app/components/LocaleToggleButton';

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
      <LocaleToggleButton />
      <Dashboard />
    </div>
  );
}
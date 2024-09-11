import Dashboard from '@/app/components/Dashboard';
import { useRouter } from 'next/router';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ];
}

export default function Home() {
  const { locale } = useRouter();
  return (
    <div>
      <Dashboard />
    </div>
  );
}
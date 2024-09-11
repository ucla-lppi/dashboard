// src/app/page.js

import { metadata } from './metadata';
import Dashboard from './components/Dashboard';

export { metadata };

export default function Home() {
  return <Dashboard />;
}
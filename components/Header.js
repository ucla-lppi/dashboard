
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/impact">Impact</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/resources">Resources</Link></li>
        </ul>
      </nav>
    </header>
  );
}
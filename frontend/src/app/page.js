'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on app load
    router.replace('/login');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    }}>
      <p style={{ color: '#fff' }}>Loading...</p>
    </div>
  );
}

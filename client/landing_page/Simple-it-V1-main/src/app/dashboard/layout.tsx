'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/organisms/dashboard/Sidebar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = Cookies.get('token');
    if (!token) {
      router.push('/'); // Redirect to login or home
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Sidebar />
      <main className="ml-64 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

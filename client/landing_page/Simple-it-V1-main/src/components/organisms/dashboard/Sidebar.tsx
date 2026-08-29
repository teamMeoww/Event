import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setRole(res.data?.data?.role);
    }).catch(console.error);
  }, []);
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col p-6 space-y-8 z-50">
      <div className="text-2xl font-bold tracking-tighter text-white">
        EventOne<span className="text-zinc-500">.</span>
      </div>
      
      <nav className="flex flex-col space-y-2 flex-grow">
        <Link href="/dashboard" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm">
          Overview
        </Link>
        {role === 'SUPER_ADMIN' ? (
          <>
            <Link href="/dashboard/approvals" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm flex items-center justify-between">
              Approvals <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
            </Link>
            <Link href="/dashboard/admin/events" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm flex items-center justify-between">
              All Events <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
            </Link>
            <Link href="/dashboard/admin/organizations" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm flex items-center justify-between">
              All Orgs <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
            </Link>
            <Link href="/dashboard/admin/volunteers" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm flex items-center justify-between">
              All Volunteers <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard/events" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm">
              My Events
            </Link>
            <Link href="/dashboard/organizations" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm">
              My Organization
            </Link>
            <Link href="/dashboard/volunteers" className="px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white font-medium text-sm">
              Volunteers
            </Link>
          </>
        )}
      </nav>

      <div className="pt-8 border-t border-zinc-800">
        <button 
          onClick={() => {
            // handle logout
            if (typeof window !== 'undefined') {
               import('js-cookie').then(Cookies => {
                 Cookies.default.remove('token');
                 window.location.href = '/login';
               });
            }
          }}
          className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white font-medium text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

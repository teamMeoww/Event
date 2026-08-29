'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVols = async () => {
      try {
        const response = await api.get('/admin/volunteers');
        setVolunteers(response.data?.data || []);
      } catch (err: any) {
        console.error('Error fetching admin volunteers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVols();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Master Volunteers List</h1>
          <p className="text-zinc-400">View all volunteers registered on the platform</p>
        </div>
      </header>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-900 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-24 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">No volunteers found in the database.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-zinc-500 font-medium">Name</th>
                <th className="p-6 text-zinc-500 font-medium">Email</th>
                <th className="p-6 text-zinc-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol, i) => (
                <tr key={vol._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-6 font-medium">{vol.name || 'Unknown'}</td>
                  <td className="p-6 text-zinc-400">{vol.email || 'N/A'}</td>
                  <td className="p-6 text-zinc-400">
                    <span className="px-3 py-1 border border-green-500/50 text-green-400 bg-green-500/10 rounded-full text-xs">
                      {vol.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

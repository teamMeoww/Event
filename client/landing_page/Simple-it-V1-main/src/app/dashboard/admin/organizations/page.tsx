'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function AdminOrgsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await api.get('/admin/organizations');
        setOrgs(response.data?.data || []);
      } catch (err: any) {
        console.error('Error fetching admin orgs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Master Organizations List</h1>
          <p className="text-zinc-400">View all organizations on the platform</p>
        </div>
      </header>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-900 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-24 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">No organizations found in the database.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-zinc-500 font-medium">Organization Name</th>
                <th className="p-6 text-zinc-500 font-medium">Owner</th>
                <th className="p-6 text-zinc-500 font-medium">Website</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org, i) => (
                <tr key={org._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-6 font-medium">{org.name || 'Untitled'}</td>
                  <td className="p-6 text-zinc-400">{org.ownerId?.email || 'N/A'}</td>
                  <td className="p-6 text-zinc-400">
                    {org.website ? (
                      <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noreferrer" className="text-[#ecff33] hover:underline">
                        Visit
                      </a>
                    ) : 'N/A'}
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

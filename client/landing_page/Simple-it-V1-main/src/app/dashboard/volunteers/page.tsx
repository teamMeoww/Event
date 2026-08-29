'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      const response = await api.get('/organizations/me/volunteers');
      setVolunteers(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching volunteers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const toggleAccess = async (volunteerId: string, currentAccess: boolean) => {
    try {
      await api.patch(`/organizations/me/volunteers/${volunteerId}/access`, {
        hasMobileAccess: !currentAccess
      });
      // Refresh list to show updated status
      fetchVolunteers();
    } catch (err) {
      console.error('Error toggling access', err);
      alert('Failed to update access');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Volunteers</h1>
          <p className="text-zinc-400">Manage your volunteers</p>
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
          <p className="text-zinc-500 mb-4">No volunteers found.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-zinc-500 font-medium">Name</th>
                <th className="p-6 text-zinc-500 font-medium">Email</th>
                <th className="p-6 text-zinc-500 font-medium">App Access</th>
                <th className="p-6 text-zinc-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol, i) => (
                <tr key={vol._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-6 font-medium">{vol.name || 'Unknown'}</td>
                  <td className="p-6 text-zinc-400">{vol.email || 'N/A'}</td>
                  <td className="p-6 text-zinc-400">
                    <span className={`px-3 py-1 border rounded-full text-xs ${vol.hasMobileAccess ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'}`}>
                      {vol.hasMobileAccess ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => toggleAccess(vol._id, vol.hasMobileAccess)}
                      className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${vol.hasMobileAccess ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-[#ecff33]/10 text-[#ecff33] hover:bg-[#ecff33]/20'}`}
                    >
                      {vol.hasMobileAccess ? 'Disable Access' : 'Enable Access'}
                    </button>
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

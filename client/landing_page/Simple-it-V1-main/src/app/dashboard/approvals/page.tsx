'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useSocketSync } from '@/hooks/useSocketSync';

export default function ApprovalsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPendingEvents = useCallback(async () => {
    try {
      const response = await api.get('/events/admin/pending');
      setEvents(response.data?.data || []);
    } catch (err: any) {
      setError('Failed to load pending events. Ensure you are an Admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingEvents();
  }, [fetchPendingEvents]);

  useSocketSync(fetchPendingEvents);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.put(`/events/admin/${id}/approve`);
      await fetchPendingEvents();
    } catch (err: any) {
      alert('Failed to approve event');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Event Approvals</h1>
          <p className="text-zinc-400">Review and approve newly created events</p>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-zinc-900 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 mb-4">No events pending approval!</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-zinc-500 font-medium">Event Name</th>
                <th className="p-6 text-zinc-500 font-medium">Organization</th>
                <th className="p-6 text-zinc-500 font-medium">Date</th>
                <th className="p-6 text-zinc-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr key={event._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-6 font-medium">{event.title || 'Untitled'}</td>
                  <td className="p-6 text-zinc-400">{event.organizationId?.name || 'Unknown'}</td>
                  <td className="p-6 text-zinc-400">
                    {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleApprove(event._id)}
                      disabled={processingId === event._id}
                      className="bg-[#ecff33] text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#d4e62e] transition-colors disabled:opacity-50"
                    >
                      {processingId === event._id ? 'Approving...' : 'Approve'}
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

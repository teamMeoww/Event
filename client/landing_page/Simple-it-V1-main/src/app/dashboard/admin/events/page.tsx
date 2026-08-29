'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useSocketSync } from '@/hooks/useSocketSync';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching admin events', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time synchronization
  useSocketSync(fetchEvents);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Master Events List</h1>
          <p className="text-zinc-400">View all events across the platform</p>
        </div>
      </header>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-900 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">No events found in the database.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-zinc-500 font-medium">Event Name</th>
                <th className="p-6 text-zinc-500 font-medium">Organization</th>
                <th className="p-6 text-zinc-500 font-medium">Organizer</th>
                <th className="p-6 text-zinc-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr key={event._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-6 font-medium">{event.title || 'Untitled'}</td>
                  <td className="p-6 text-zinc-400">{event.organizationId?.name || 'N/A'}</td>
                  <td className="p-6 text-zinc-400">{event.organizerId?.email || 'N/A'}</td>
                  <td className="p-6 text-zinc-400">
                    <span className={`px-3 py-1 border rounded-full text-xs ${
                      event.status === 'PUBLISHED' ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                      : event.status === 'PENDING_APPROVAL' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                      : 'border-zinc-700 text-zinc-400 bg-zinc-900'
                    }`}>
                      {event.status || 'UNKNOWN'}
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

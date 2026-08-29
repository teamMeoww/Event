'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: '',
    isBlockchainEnabled: false,
    capacity: 100,
    price: 0,
    category: 'Conference'
  });
  const [myOrg, setMyOrg] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/my/events');
      setEvents(response.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    api.get('/organizations/me').then(res => setMyOrg(res.data?.data)).catch(console.error);
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Backend expects 'category' which is an enum. (Wait, is it? Let's assume some defaults for now).
      await api.post('/events', formData);
      await fetchEvents(); // Refresh list
      setIsModalOpen(false); // Close modal
      // Reset form
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        imageUrl: '',
        isBlockchainEnabled: false,
        capacity: 100,
        price: 0,
        category: 'Conference'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event. Ensure you have created an Organization first.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">My Events</h1>
          <p className="text-zinc-400">Manage your events</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          Create Event
        </button>
      </header>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-900 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 mb-4">No events found.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-white hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            Create your first event
          </button>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-zinc-500 font-medium">Event Name</th>
                <th className="p-6 text-zinc-500 font-medium">Date</th>
                <th className="p-6 text-zinc-500 font-medium">Location</th>
                <th className="p-6 text-zinc-500 font-medium">Status</th>
                <th className="p-6 text-zinc-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr key={event._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-6 font-medium">{event.title || 'Untitled Event'}</td>
                  <td className="p-6 text-zinc-400">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="p-6 text-zinc-400">{event.location || 'TBA'}</td>
                  <td className="p-6 text-zinc-400">
                    <span className={`px-3 py-1 border rounded-full text-xs ${event.status === 'PUBLISHED' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-zinc-700 text-zinc-400 bg-zinc-900'}`}>
                      {event.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-sm text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-white underline-offset-4">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-xl shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">Create New Event</h2>
            <p className="text-zinc-400 mb-6 text-sm">
              Creating event for: <strong className="text-white bg-zinc-900 px-2 py-1 rounded">{myOrg?.name || 'Loading...'}</strong>
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  placeholder="Tech Meetup 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  required
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors min-h-[100px]"
                  placeholder="What is this event about?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  placeholder="123 Main St, City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="blockchain"
                  checked={formData.isBlockchainEnabled}
                  onChange={e => setFormData({ ...formData, isBlockchainEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#ecff33] rounded"
                />
                <div>
                  <label htmlFor="blockchain" className="text-white font-medium block">Enable Blockchain Ticketing</label>
                  <span className="text-xs text-zinc-400">Attendees will be required to verify their Web3 Wallet.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-200 transition-colors mt-6 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

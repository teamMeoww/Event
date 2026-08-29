'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function OrganizationsPage() {
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', website: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchMyOrganization = async () => {
    try {
      const response = await api.get('/organizations/me');
      setOrganization(response.data?.data || null);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Error fetching organization', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrganization();
  }, []);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/organizations', formData);
      await fetchMyOrganization();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">My Organization</h1>
          <p className="text-zinc-400">Manage your organization profile</p>
        </div>
        {!organization && !loading && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
          >
            Create Organization
          </button>
        )}
      </header>

      {loading ? (
        <div className="animate-pulse h-48 bg-zinc-900 rounded-3xl w-full"></div>
      ) : organization ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-4">{organization.name}</h2>
          <p className="text-zinc-400 mb-6">{organization.description || 'No description provided.'}</p>
          
          <div className="flex gap-4">
            {organization.website && (
              <a 
                href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 mb-4">You do not belong to any organization yet.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-white hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            Create one now
          </button>
        </div>
      )}

      {/* Create Organization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">Create Organization</h2>
            <p className="text-zinc-400 mb-6 text-sm">You need an organization to host events.</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Organization Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  placeholder="Acme Events Co."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors min-h-[100px]"
                  placeholder="Tell us about your organization..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Website URL (Optional)</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  placeholder="example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-200 transition-colors mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Organization'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

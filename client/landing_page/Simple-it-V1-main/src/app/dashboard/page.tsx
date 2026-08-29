'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useSocketSync } from '@/hooks/useSocketSync';

export default function DashboardOverview() {
  const [role, setRole] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [orgStats, setOrgStats] = useState({ events: 0, volunteers: 0, organizations: 0 });
  const [volUser, setVolUser] = useState<any>(null);
  const [volEvents, setVolEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const userRes = await api.get('/auth/me');
      const userRole = userRes.data?.data?.role;
      setRole(userRole);

      if (userRole === 'SUPER_ADMIN') {
        const adminRes = await api.get('/admin/stats');
        setAdminStats(adminRes.data?.data);
      } else {
        const [eventsRes, orgRes, volRes] = await Promise.all([
          api.get('/events/my/events').catch(() => ({ data: { data: [] } })),
          api.get('/organizations/me').catch(() => ({ data: { data: null } })),
          api.get('/volunteer').catch(() => ({ data: { data: [] } })),
        ]);

        setOrgStats({
          events: eventsRes.data?.data?.length || 0,
          organizations: orgRes.data?.data ? 1 : 0,
          volunteers: volRes.data?.data?.length || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching stats', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Real-time synchronization
  useSocketSync(fetchDashboard);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Dashboard Overview</h1>
          <p className="text-xl text-zinc-400 font-light">
            {role === 'SUPER_ADMIN' ? 'System-wide metrics and analytics.' : "Welcome back! Here's what's happening today."}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-zinc-900 rounded-2xl w-full"></div>
          <div className="h-32 bg-zinc-900 rounded-2xl w-full"></div>
        </div>
      ) : role === 'VOLUNTEER' && volUser ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] border bg-zinc-950 border-zinc-800">
              <h3 className="text-zinc-400 font-medium mb-4">Profile Information</h3>
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">{volUser.name}</p>
                <p className="text-zinc-400">{volUser.email}</p>
                <div className="pt-4 mt-4 border-t border-zinc-800/50">
                  <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-zinc-300 font-medium tracking-wide">
                    VOLUNTEER
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] border ${volUser.hasMobileAccess ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <h3 className="text-zinc-400 font-medium mb-2">Mobile App Access</h3>
              <div className="flex items-center space-x-4">
                <span className={`h-4 w-4 rounded-full ${volUser.hasMobileAccess ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                <p className={`text-3xl font-bold ${volUser.hasMobileAccess ? 'text-green-400' : 'text-red-400'}`}>
                  {volUser.hasMobileAccess ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              {!volUser.hasMobileAccess && (
                <p className="mt-4 text-sm text-zinc-500">Contact an Organizer to enable your access to the mobile scanning app.</p>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2 pt-4">Assigned Events</h2>
          {volEvents.length === 0 ? (
            <div className="text-center py-12 bg-zinc-950 border border-zinc-800 rounded-3xl">
              <p className="text-zinc-500">You are not assigned to any events yet.</p>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="p-6 text-zinc-500 font-medium">Event</th>
                    <th className="p-6 text-zinc-500 font-medium">Organization</th>
                    <th className="p-6 text-zinc-500 font-medium">Date</th>
                    <th className="p-6 text-zinc-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {volEvents.map((event, i) => (
                    <tr key={event._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-6 font-medium text-white">{event.title}</td>
                      <td className="p-6 text-zinc-400">{event.organizationId?.name || 'Unknown Org'}</td>
                      <td className="p-6 text-zinc-400">{new Date(event.startDate).toLocaleDateString()}</td>
                      <td className="p-6">
                        <span className="px-3 py-1 border border-zinc-700 text-zinc-400 bg-zinc-900 rounded-full text-xs">
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : role === 'SUPER_ADMIN' && adminStats ? (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2">Events Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Events" value={adminStats.events.total} />
            <StatCard title="Pending Approvals" value={adminStats.events.pending} highlight />
            <StatCard title="Published Events" value={adminStats.events.published} />
          </div>

          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2 pt-4">User Demographics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={adminStats.users.total} />
            <StatCard title="Participants" value={adminStats.users.participants} />
            <StatCard title="Volunteers" value={adminStats.users.volunteers} />
            <StatCard title="Organizers" value={adminStats.users.organizers} />
          </div>

          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2 pt-4">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Organizations" value={adminStats.organizations.total} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="My Events" value={orgStats.events} />
          <StatCard title="My Volunteers" value={orgStats.volunteers} />
          <StatCard title="My Organizations" value={orgStats.organizations} />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, highlight = false }: { title: string; value: number, highlight?: boolean }) {
  return (
    <div className={`border p-8 rounded-[2rem] transition-all duration-300 group ${highlight
        ? 'bg-[#ecff33]/10 border-[#ecff33]/30 hover:bg-[#ecff33]/20'
        : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900'
      }`}>
      <h3 className={`font-medium mb-4 transition-colors ${highlight ? 'text-[#d4e62e]' : 'text-zinc-500 group-hover:text-zinc-400'
        }`}>{title}</h3>
      <p className={`text-6xl font-bold tracking-tighter ${highlight ? 'text-[#ecff33]' : 'text-white'}`}>{value}</p>
    </div>
  );
}

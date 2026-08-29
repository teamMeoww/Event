'use client';

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface CheckinEvent {
    id: string;
    message: string;
    timestamp: Date;
}

export default function AdminDashboard() {
    const [checkinCount, setCheckinCount] = useState(0);
    const [recentCheckins, setRecentCheckins] = useState<CheckinEvent[]>([]);
    
    // Hardcoded Event ID for demonstration (would normally come from auth/context)
    const eventId = "evt_123456";

    useEffect(() => {
        // Animate initial load
        gsap.fromTo(".dashboard-item", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
        );

        // Connect to SSE Endpoint on the Spring Boot checkin-service
        const eventSource = new EventSource(`http://localhost:8085/api/v1/checkins/stream/${eventId}`);

        eventSource.onmessage = (event) => {
            console.log("Received SSE data:", event.data);
        };

        eventSource.addEventListener("INIT", (event) => {
            console.log("SSE Connected:", event.data);
        });

        eventSource.addEventListener("CHECKIN", (event) => {
            console.log("New Check-in:", event.data);
            setCheckinCount(prev => {
                const newCount = prev + 1;
                // Animate count change
                gsap.fromTo(".count-display", 
                    { scale: 1.2, color: "#ecff33" }, 
                    { scale: 1, color: "#ffffff", duration: 0.5 }
                );
                return newCount;
            });
            
            setRecentCheckins(prev => {
                const newEvent = {
                    id: Math.random().toString(36).substring(7),
                    message: event.data,
                    timestamp: new Date()
                };
                return [newEvent, ...prev].slice(0, 10); // Keep last 10
            });
        });

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            // eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8 md:p-16 pt-32">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 dashboard-item">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Event Dashboard</h1>
                    <p className="text-zinc-400">Live monitoring for event: {eventId}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Metrics Column */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl dashboard-item">
                            <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-4">Live Check-ins</h2>
                            <div className="text-6xl font-black count-display">
                                {checkinCount}
                            </div>
                            <p className="text-zinc-400 mt-4 text-sm">Real-time count of scanned tickets at the door.</p>
                        </div>
                    </div>

                    {/* Feed Column */}
                    <div className="md:col-span-2">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl min-h-[400px] dashboard-item">
                            <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-6">Recent Scans</h2>
                            
                            {recentCheckins.length === 0 ? (
                                <div className="text-zinc-600 italic text-center py-12">
                                    Waiting for first scan...
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentCheckins.map((scan, i) => (
                                        <div key={scan.id} 
                                             className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                                             style={{ animation: `fade-in 0.5s ease-out` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 bg-[#ecff33] rounded-full shadow-[0_0_10px_#ecff33]" />
                                                <span className="font-medium">{scan.message}</span>
                                            </div>
                                            <span className="text-xs text-zinc-500">
                                                {scan.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useAuth } from './useAuth';

export interface CheckinEvent {
    id: string;
    participantName: string;
    ticketType: string;
    timestamp: Date;
    status: string;
}

export function useCheckinStream(eventId?: string) {
    const [checkins, setCheckins] = useState<CheckinEvent[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        if (!eventId || !token) return;
        
        const controller = new AbortController();

        const connect = async () => {
            await fetchEventSource(`http://localhost:8085/api/v1/checkins/stream/${eventId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                signal: controller.signal,
                onmessage(event) {
                    try {
                        const data = JSON.parse(event.data);
                        
                        const newCheckin: CheckinEvent = {
                            id: Math.random().toString(36).substr(2, 9),
                            participantName: data.participantName || 'Anonymous',
                            ticketType: data.ticketType || 'General',
                            timestamp: new Date(),
                            status: 'Confirmed'
                        };

                        setCheckins(prev => [newCheckin, ...prev].slice(0, 50));
                    } catch (e) {
                        console.error("Error parsing SSE message", e);
                        const newCheckin: CheckinEvent = {
                            id: Math.random().toString(36).substr(2, 9),
                            participantName: 'New Scan',
                            ticketType: 'Unknown',
                            timestamp: new Date(),
                            status: 'Confirmed'
                        };
                        setCheckins(prev => [newCheckin, ...prev].slice(0, 50));
                    }
                },
                onerror(err) {
                    console.error("SSE Error:", err);
                    throw err; // throw to trigger retry if needed
                }
            });
        };

        connect();

        return () => {
            controller.abort();
        };
    }, [eventId, token]);

    return checkins;
}

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Event {
    id: string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    status: string;
}

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        async function fetchEvents() {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:8081/api/v1/events', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data.data.content);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchEvents();
    }, [token]);

    return { events, loading };
}

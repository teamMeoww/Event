import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export function useSocketSync(onUpdate: () => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Listen for the SYSTEM_UPDATE event
    socketRef.current.on('SYSTEM_UPDATE', (data) => {
      console.log('Received SYSTEM_UPDATE:', data);
      onUpdate();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onUpdate]);
}

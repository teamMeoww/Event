'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TransitionContextType {
  isTransitioning: boolean;
  targetLabel: string;
  startTransition: (label?: string) => void;
  completeTransition: () => void;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetLabel, setTargetLabel] = useState('');

  const startTransition = useCallback((label = '') => {
    setTargetLabel(label);
    setIsTransitioning(true);
  }, []);

  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
    setTargetLabel('');
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, targetLabel, startTransition, completeTransition, setIsTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
}

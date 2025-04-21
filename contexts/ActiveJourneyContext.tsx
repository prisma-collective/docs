'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

type JourneyData = {
  journeyId: string;
  journeyName: string;
};

type ActiveJourneyType = {
    journeyData: JourneyData | null;
    fetchJourneyData: () => Promise<void>;
};

const ActiveJourneyContext = createContext<ActiveJourneyType | undefined>(undefined);

export function ActiveJourneyProvider({ children }: { children: ReactNode }) {
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);

  const fetchJourneyData = async () => {
    try {
      const res = await fetch('/mock_journey_did.json');
      if (!res.ok) {
        throw new Error('Failed to fetch journey data');
      }
      const data = await res.json();
      setJourneyData(data);
    } catch (error) {
      console.error('Error fetching journey data:', error);
    }
  };

  return (
    <ActiveJourneyContext.Provider value={{ journeyData, fetchJourneyData }}>
      {children}
    </ActiveJourneyContext.Provider>
  );
}

export function useActiveJourney() {
  const context = useContext(ActiveJourneyContext);
  if (!context) {
    throw new Error('useActiveJourney must be used within a ActiveJourneyProvider');
  }
  return context;
}

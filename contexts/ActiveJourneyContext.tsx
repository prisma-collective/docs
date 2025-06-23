'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

const MOCK_JOURNEY_DID = {
  "journeyId": "0xrh3rh803ht38023t8024gh0i2hg2oewvhfghal2r0h",
  "journeyName": "Accra Resource Centre"
}

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
      setJourneyData(MOCK_JOURNEY_DID);
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

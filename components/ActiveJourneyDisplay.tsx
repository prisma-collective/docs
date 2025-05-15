'use client';

import React, { useEffect } from "react";
import { RiRadioButtonLine } from "react-icons/ri";
import { useActiveJourney } from "@/contexts/ActiveJourneyContext"; // Adjust if necessary

const ActiveJourneyDisplay: React.FC = () => {
  const { journeyData, fetchJourneyData } = useActiveJourney();

  useEffect(() => {
    fetchJourneyData();
  }, [fetchJourneyData]);

  return (
    <div>
      <label className="text-gray-500 text-sm">
        action-learning journey id
      </label>
      <div className="flex w-full mb-8 h-8 border-[1px] border-gray-700 rounded-md overflow-hidden bg-gray-900">
        <input
          className="flex-1 bg-gray-900 text-gray-600 p-2 outline-none truncate cursor-default text-sm"
          value={journeyData?.journeyId || "loading..."}
          disabled
        />
        <a href="/events/accra" className="flex">
          <div className="flex min-w-[150px] bg-gray-900 text-gray-400 p-2 items-center truncate cursor-pointer text-sm">
            <RiRadioButtonLine className="w-2.5 h-2.5 text-green-400 mr-1.5 mt-0.5 animate-pulse" />
            {journeyData?.journeyName || "loading..."}
          </div>
        </a>
      </div>
    </div>
  );
};

export default ActiveJourneyDisplay;

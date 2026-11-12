"use client";

import { useState } from 'react';
import teamData from '@/public/team.json';
import { FaXTwitter, FaTelegram, FaGithub, FaLinkedinIn, FaPhone, FaGlobe } from "react-icons/fa6";
import { ProfileCard } from './ProfileCard';
import { MdOutlineEmail } from "react-icons/md";

interface TeamLink {
  label: string;
  url: string;
  icon: 'FaXTwitter' | 'FaTelegram' | 'FaGithub' | 'FaLinkedinIn' | 'FaPhone' | 'FaGlobe';
}

export interface TeamMember {
  name: string;
  role: string;
  profile_card_link: string;
  photo: string;
  links: TeamLink[];
}

export const iconMap = {
  FaXTwitter: FaXTwitter,
  FaTelegram: FaTelegram,
  FaGithub: FaGithub, 
  FaLinkedinIn: FaLinkedinIn,
  FaPhone: FaPhone,
  FaGlobe: FaGlobe,
  Email: MdOutlineEmail,
};

interface TeamCardsProps {
  team?: TeamMember[];
}

export default function TeamCards({ team }: TeamCardsProps) {
  const dataToUse = team ?? (teamData as TeamMember[]);

  // Global cache for Telegram data
  const [telegramCache, setTelegramCache] = useState<Map<string, any>>(new Map());

  // Function to fetch Telegram data (if not in cache)
  const fetchTelegramData = async (handle: string): Promise<any> => {
    if (telegramCache.has(handle)) {
      return telegramCache.get(handle); // Return cached data
    }

    try {
      const res = await fetch(`/api/participants/${handle}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }

      const data = await res.json();
  
      // Update the cache
      setTelegramCache((prevCache) => new Map(prevCache).set(handle, data));
  
      return data;  // Returning the data as a Promise resolve.
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;  // Returning null in case of an error
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {dataToUse.map((member, index) => (
        <ProfileCard
          key={index}
          name={member.name}
          role={member.role}
          profile_card_link={member.profile_card_link}
          avatar={member.photo}
          links={member.links.map((link) => {
            const Icon = iconMap[link.icon];
            return {
              label: link.label,
              url: link.url,
              icon: Icon ? <Icon className="w-3 h-3" /> : null,
            };
          })}
          fetchTelegramData={fetchTelegramData}
          telegramCache={telegramCache}
        />
      ))}
    </div>
  );
}

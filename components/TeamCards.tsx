"use client";

import { useState } from 'react';
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
  // Default empty array if no data provided
  let dataToUse: TeamMember[] = team ?? [];
  
  // Try to load team data, but don't fail if it doesn't exist
  if (!team) {
    try {
      const teamData = require('@/public/team.json');
      dataToUse = teamData as TeamMember[];
    } catch (error) {
      console.warn('team.json not found, using empty array');
      dataToUse = [];
    }
  }

  const [telegramCache, setTelegramCache] = useState<Map<string, any>>(new Map());

  const fetchTelegramData = async (handle: string): Promise<any> => {
    if (telegramCache.has(handle)) {
      return telegramCache.get(handle);
    }

    try {
      const res = await fetch(`/api/participants/${handle}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }

      const data = await res.json();
      setTelegramCache((prevCache) => new Map(prevCache).set(handle, data));
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  // Show message if no team data
  if (dataToUse.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Team information will be added soon.
      </div>
    );
  }

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
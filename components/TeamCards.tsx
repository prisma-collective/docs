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

const iconMap = {
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
        />
      ))}
    </div>
  );
}

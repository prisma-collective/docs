import teamData from '@/public/team.json';
import { FaXTwitter, FaTelegram, FaGithub, FaLinkedinIn, FaPhone } from "react-icons/fa6"; // import icons
import { ProfileCard } from './ProfileCard'; // <-- using the new ProfileCard

interface TeamLink {
  label: string;
  url: string;
  icon: 'FaXTwitter' | 'FaTelegram' | 'FaGithub' | 'FaLinkedinIn' | 'FaPhone';
}

interface TeamMember {
  name: string;
  photo: string;
  links: TeamLink[];
}

// Create a mapping from name -> icon component
const iconMap = {
  FaXTwitter: FaXTwitter,
  FaTelegram: FaTelegram,
  FaGithub: FaGithub, 
  FaLinkedinIn: FaLinkedinIn,
  FaPhone: FaPhone
};

const typedTeamData = teamData as TeamMember[];

export default function TeamCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {typedTeamData.map((member, index) => (
        <ProfileCard
          key={index}
          name={member.name}
          avatar={member.photo}
          links={member.links.map((link) => {
            const Icon = iconMap[link.icon];
            return {
              label: link.label,
              url: link.url,
              icon: Icon ? <Icon className="w-5 h-5" /> : null
            };
          })}
        />
      ))}
    </div>
  );
};

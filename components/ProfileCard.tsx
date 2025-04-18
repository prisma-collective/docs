import Image from "next/image";
import { Link } from "nextra-theme-docs";
import type { FC, ReactNode } from "react";

interface ProfileCardProps {
  name: string;
  role?: string;
  avatar: string;
  profile_card_link?: string;
  links?: {
    label: string;
    url: string;
    icon: ReactNode;
  }[];
  className?: string;
}

export const ProfileCard: FC<ProfileCardProps> = ({ name, role, profile_card_link, avatar, links = [], className }) => {
  return (
    <div
      className={
        `flex flex-col items-center rounded-xl border p-6 transition hover:border-[#c362ff]/50 dark:border-neutral-700 bg-white dark:bg-gray-700/30 ${className}`
      }
    >
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={avatar}
          alt={name}
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <p className="text-lg font-semibold text-gray-800 dark:text-white">{name}</p>
      {role && <Link href={profile_card_link} className="text-md">{role}</Link>}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            {link.icon}
            <span className="text-xs">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

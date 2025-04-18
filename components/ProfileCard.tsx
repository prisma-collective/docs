import Image from "next/image";
import type { FC, ReactNode } from "react";

interface ProfileCardProps {
  name: string;
  role?: string;
  avatar: string;
  links?: {
    label: string;
    url: string;
    icon: ReactNode;
  }[];
  className?: string;
}

export const ProfileCard: FC<ProfileCardProps> = ({ name, role, avatar, links = [], className }) => {
  return (
    <div
      className={
        `flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 ${className}`
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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h3>
      {role && <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            {link.icon}
            <span className="text-sm">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
'use client';

import Image from 'next/image';
import { FC } from 'react';
import { FiExternalLink } from 'react-icons/fi';

interface AppCardProps {
  name: string;
  description: string;
  image: string;
  externalLoc: string;
  onSelect: () => void;
}

const AppCard: FC<AppCardProps> = ({ name, description, image, externalLoc, onSelect }) => {
  return (
    <div className="relative">
        {/* External link button */}
        <a
            href={externalLoc}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 z-10 p-1 bg-neutral-800 hover:bg-neutral-700 rounded-full"
            onClick={(e) => e.stopPropagation()}
            title="Open in new tab"
        >
            <FiExternalLink className="w-5 h-5 text-white p-1 hover:text-green-400" />
        </a>

        <button
          type="button"
          onClick={onSelect}
          className='flex flex-col sm:flex-row items-center w-full text-left border rounded-2xl p-4 transition border-neutral-600 hover:bg-prisma-b/50 cursor-pointer hover:border-prisma-b'
        >
          <div className="w-32 h-32 relative flex-shrink-0">
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>

          <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 flex-1">
            <h3 className="text-lg font-semibold text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </button>
      </div>
  );
};

export default AppCard;

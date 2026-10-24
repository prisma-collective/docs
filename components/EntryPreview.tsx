import { FC, JSX } from 'react';
import {
  FaRegFileAlt,
  FaRegImage,
  FaVideo,
  FaLink,
  FaRegCommentDots,
  FaFileAudio,
} from 'react-icons/fa';

type EntryPreviewProps = {
  entry: any;
  type: string;
};

const iconMap: Record<string, JSX.Element> = {
  text: <FaRegFileAlt size={24} />,
  photo: <FaRegImage size={24} />,
  voice: <FaFileAudio size={24} />,
  video: <FaVideo size={24} />,
  videoNote: <FaVideo size={24} />,
  entity: <FaLink size={24} />,
  caption: <FaRegCommentDots size={24} />,
};

const EntryPreview: FC<EntryPreviewProps> = ({ entry, type }) => {
  const icon = iconMap[type] || <FaRegFileAlt size={24} />;
  const content =
    entry?.text?.text ||
    entry?.caption?.text ||
    entry?.entity?.name ||
    '[No content]';

  return (
    <div className="flex w-full rounded-lg border border-neutral-700 p-4 bg-transparent hover:bg-gray-900">
      <div className="w-1/5 flex items-center justify-center text-prisma-b ">{icon}</div>
      <div className="w-auto text-sm text-gray-700 dark:text-gray-100">{content}</div>
    </div>
  );
};

export default EntryPreview;

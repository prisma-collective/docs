import { FC, JSX } from 'react';
import {
  FaRegFileAlt,
  FaRegImage,
  FaMicrophoneAlt,
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
  text: <FaRegFileAlt size={32} />,
  photo: <FaRegImage size={32} />,
  voice: <FaFileAudio size={32} />,
  video: <FaVideo size={32} />,
  videoNote: <FaVideo size={32} />,
  entity: <FaLink size={32} />,
  caption: <FaRegCommentDots size={32} />,
};

const EntryPreview: FC<EntryPreviewProps> = ({ entry, type }) => {
  const icon = iconMap[type] || <FaRegFileAlt size={32} />;
  const content =
    entry?.text?.text ||
    entry?.caption?.text ||
    entry?.entity?.name ||
    '[No content]';

  return (
    <div className="flex w-full rounded-xl border border-gray-200 p-4 shadow-sm bg-white">
      <div className="w-2/5 flex items-center justify-center text-gray-500">{icon}</div>
      <div className="w-3/5 text-sm text-gray-700">{content}</div>
    </div>
  );
};

export default EntryPreview;

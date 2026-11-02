import { Link } from "nextra-theme-docs";
import { FaXTwitter, FaTelegram, FaGithub, FaLinkedinIn, FaPhone, FaGlobe } from "react-icons/fa6";

export const iconMap = {
  FaXTwitter: FaXTwitter,
  FaTelegram: FaTelegram,
  FaGithub: FaGithub, 
  FaLinkedinIn: FaLinkedinIn,
  FaPhone: FaPhone,
  FaGlobe: FaGlobe,
};

interface TableField {
  label: string;
  value: string;
  href?: string;
}

interface EventCardProps {
  title?: string;
  fields: TableField[];
  intensiveDates?: string;
  className?: string;
  links?: EventLink[];
}

interface EventLink {
    label: string;
    url: string;
    icon: 'FaXTwitter' | 'FaTelegram' | 'FaGithub' | 'FaLinkedinIn' | 'FaPhone' | 'FaGlobe';
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  fields,
  intensiveDates,
  className = "",
  links,
}) => {

  return (
    <div
      className={`relative flex flex-col text-left rounded-xl 
        transition
        bg-prisma-b/10
        border-1
        border-prisma-b
        p-4
        mt-4
        ${className}`}
    >
        {intensiveDates && (
        <span className="text-sm text-gray-400 mr-1 pointer-events-none italic mb-4">
            {intensiveDates}
        </span>
        )}

        {title && (
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white mb-2">
            {title}
        </h1>
        )}

        <div className="flex flex-row gap-4 mb-4">
            {links?.map((link, idx) => {
                const Icon = iconMap[link.icon];
                return (
                    <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                        {Icon && <Icon className="w-3 h-3"/>}
                        <span className="text-xs">{link.label}</span>
                    </a>
                );
            })}
        </div>

        <div className="flex flex-col mb-10 md:mb-0 z-10">
            {fields.map((field, idx) => (
                <div key={idx} className="flex py-1">
                    {/* Label column — fixed width */}
                    <div className="w-1/3 md:w-1/6 pr-4 text-lg text-gray-600 dark:text-gray-300 text-left">
                        {field.href ? (
                        <Link
                            href={field.href}
                            className="text-purple-600 hover:underline dark:text-purple-400 font-custom-bold"
                        >
                            {field.label}
                        </Link>
                        ) : (
                        field.label
                        )}
                    </div>

                    {/* Value column — fills remaining space */}
                    <div className="flex-1 text-sm text-gray-800 dark:text-white">
                        {field.value}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

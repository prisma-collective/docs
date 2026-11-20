"use client";

import { useEffect, useState } from 'react';
import TeamCards, { TeamMember } from './TeamCards';

interface CohortCardsProps {
  event_api_id: string;
}

export default function CohortCards({ event_api_id }: CohortCardsProps) {
  const [guests, setGuests] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await fetch(`/api/cohort?event_api_id=${event_api_id}`);
        const data = await res.json();

        if (!data?.entries || !Array.isArray(data.entries)) {
          console.error('Unexpected guest data format:', data);
          return;
        }

        const formattedGuests: TeamMember[] = data.entries.map((entry: any) => {
          const participant = entry.guest;

          return {
            name: participant.user_first_name ? `${participant.user_first_name} ${participant.user_last_name}` : `${participant.user_name}`,
            role: `${participant.registration_answers.find((a: any) => a.label === 'Role')?.answer ?? 'Participant'}`,
            profile_card_link: ` ${participant.registration_answers.find((a: any) => a.label.includes('A link'))?.answer ?? '#'}`,
            links: [
              ...(participant.registration_answers || []).map((answer: any) => {
                const label = answer.label.toLowerCase();
                
                if (typeof answer.answer === 'string') {
                  const answerText = answer.answer?.trim();
                  if (!answerText) return null;

                  const isUrl = answerText.startsWith('https://');

                  if (label.includes('telegram handle')) {
                    const url = isUrl ? answerText : `https://t.me/${answerText.replace(/^@/, '')}`;
                    return {
                      label: 'Message',
                      url,
                      icon: 'FaTelegram',
                    };
                  }

                  if (label.includes('cal.com')) {
                    const url = isUrl ? answerText : `https://cal.com/${answerText.replace(/^@/, '')}`;
                    return {
                      label: 'Meet',
                      url,
                      icon: 'FaPhone',
                    };
                  }

                  if (label.includes('x (twitter)')) {
                    const url = isUrl ? answerText : `https://twitter.com/${answerText.replace(/^@/, '')}`;
                    return {
                      label: 'X (Twitter)',
                      url,
                      icon: 'FaXTwitter',
                    };
                  }

                  if (label.includes('github')) {
                    const url = isUrl ? answerText : `https://github.com/${answerText.replace(/^@/, '')}`;
                    return {
                      label: 'GitHub',
                      url,
                      icon: 'FaGithub',
                    };
                  }
                }
                return null;
              }).filter(Boolean),
              {
                label: 'Email',
                url: `mailto:${participant.user_email}`,
                icon: 'Email',
              },
            ].filter(Boolean),
          };
        });

        setGuests(formattedGuests);
      } catch (err) {
        console.error('Failed to fetch participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [event_api_id]);

  if (loading) return <div>Loading participants...</div>;

  return <TeamCards team={guests} />;
}

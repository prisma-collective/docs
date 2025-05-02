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
            name: `${participant.user_first_name} ${participant.user_last_name}`,
            role: `${participant.registration_answers.find((a: any) => a.label === 'Role')?.answer ?? 'Participant'}`,
            profile_card_link: '#',
            links: [
              ...(participant.registration_answers || []).map((answer: any) => {
                const label = answer.label.toLowerCase();
                if (label.includes('telegram handle') && answer.answer != "") {
                  return {
                    label: 'Message',
                    url: answer.answer,
                    icon: 'FaTelegram',
                  };
                }
                if (label.includes('cal.com') && answer.answer != "") {
                  return {
                    label: 'Meet',
                    url: answer.answer,
                    icon: 'FaPhone',
                  };
                }
                if (label.includes('a link') && answer.answer != "") {
                  return {
                    label: 'Resource',
                    url: answer.answer,
                    icon: 'FaGlobe',
                  };
                }
                if (label.includes('x (twitter)') && answer.answer != "") {
                  return {
                    label: 'Resource',
                    url: answer.answer,
                    icon: 'FaXTwitter',
                  };
                }
                if (label.includes('github') && answer.answer != "") {
                  return {
                    label: 'GitHub',
                    url: answer.answer,
                    icon: 'FaGithub',
                  };
                }
                return null;
              }).filter(Boolean),
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

import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import ContributorChart from '@/components/ContributorChart'; 
import AspectsWithPrisma from '@/components/AspectsWithPrisma';
import StandardButton from '@/components/StandardButton';
import TeamCards from '@/components/TeamCards';
import ActiveJourneyDisplay from '@/components/ActiveJourneyDisplay';
import CohortCards from '@/components/CohortCards';
import { EventCard } from '@/components/EventCard';
import TeamTabs from '@/components/TeamTabs';
import TopicTabs from '@/components/TopicTabs'

// Get the default MDX components
const themeComponents = getThemeComponents()
 
// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ContributorChart, 
    AspectsWithPrisma,
    StandardButton,
    TeamCards,
    ActiveJourneyDisplay,
    CohortCards,
    EventCard,
    TeamTabs,
    TopicTabs,
    ...components
  }
}

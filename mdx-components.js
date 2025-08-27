import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import ContributorChart from '@/components/ContributorChart'; 
import AspectsWithPrisma from '@/components/AspectsWithPrisma';
import StandardButton from '@/components/StandardButton';
import TeamCards from '@/components/TeamCards';
import ActiveJourneyDisplay from '@/components/ActiveJourneyDisplay';
import CohortCards from '@/components/CohortCards';
import { EventCard } from '@/components/EventCard';
import TeamTabs from '@/components/TeamTabs';
import TopicTabs from '@/components/TopicTabs'
import GraphVisualisation from '@/components/GraphVisualisation';
import AppGrid from '@/components/AppGrid';
import SystemDiagramPI from '@/components/SystemDiagramProcessInfrastructure';
import PageGate from '@/components/PageGate';
import GraphRenderer from './components/GraphRenderer';
import FeatureText from '@/components/FeatureText';

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
    GraphVisualisation,
    GraphRenderer,
    AppGrid,
    SystemDiagramPI,
    PageGate,
    FeatureText,
    ...components
  }
}

import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import ContributorChart from '@/components/ContributorChart'; 
import AspectsWithPrisma from '@/components/AspectsWithPrisma';
import StandardButton from '@/components/StandardButton';
import TeamCards from '@/components/TeamCards';
import CohortCards from '@/components/CohortCards';
import { EventCard } from '@/components/EventCard';
import TeamTabs from '@/components/TeamTabs';
import TopicTabs from '@/components/TopicTabs'
import GraphVisualisation from '@/components/GraphVisualisation';
import AppGrid from '@/components/AppGrid';
import SystemDiagramPI from '@/components/SystemDiagramProcessInfrastructure';
import GraphRenderer from './components/GraphRenderer';
import FeatureText from '@/components/FeatureText';
import ProjectClusterViewerWrapper from '@/components/ProjectClusterViewerWrapper';
import PreviewHero from '@/components/GlobePreview';
import CasePreview from '@/components/CasePreview';
import PrivatePageShell from '@/components/PrivatePageShell';
import PrivateAssetNotice from '@/components/PrivateAssetNotice';

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
    CohortCards,
    EventCard,
    TeamTabs,
    TopicTabs,
    GraphVisualisation,
    GraphRenderer,
    AppGrid,
    SystemDiagramPI,
    FeatureText,
    ProjectClusterViewerWrapper,
    PreviewHero,
    CasePreview,
    PrivatePageShell,
    PrivateAssetNotice,
    ...components
  }
}

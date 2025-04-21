import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import ContributorChart from '@/components/ContributorChart'; 
import AspectsWithPrisma from '@/components/AspectsWithPrisma';
import StandardButton from '@/components/StandardButton';
import TeamCards from '@/components/TeamCards';
import Input from '@/components/Input';

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
    Input,
    ...components
  }
}

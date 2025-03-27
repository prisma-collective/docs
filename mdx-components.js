import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import ContributorChart from './components/ContributorChart'; 
import AspectsWithPrisma from './components/AspectsWithPrisma';
import Button from './components/Button';
import { PageGate } from './components/PageGate';
// Get the default MDX components
const themeComponents = getThemeComponents()
 
// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ContributorChart, 
    AspectsWithPrisma,
    PageGate,
    Button,
    ...components
  }
}
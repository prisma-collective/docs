import { getTeamsData } from '@/lib/data';
import ProjectClusterViewer from './ProjectClusterViewer';

export default function ProjectClusterViewerWrapper() {
  const teams = getTeamsData();
  return <ProjectClusterViewer teams={teams} />;
}
import { getFundamentalsViews } from '@/lib/fundamentals';
import ProjectFundamentalsViewer from './ProjectFundamentalsViewer';

export default function ProjectFundamentalsViewerWrapper() {
  const views = getFundamentalsViews();
  return <ProjectFundamentalsViewer views={views} />;
}

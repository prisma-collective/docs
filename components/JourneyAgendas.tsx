import shapesData from '@/data/agenda.json'; 
import { format, parseISO } from 'date-fns';

export interface Journey {
  version: number;
  start: string; // ISO date string
  end: string;   // ISO date string
  phases: Record<string, Phase>;
  actions: Record<string, Action>;
}

export interface Phase {
  start: string; // ISO date string
  end: string;   // ISO date string
  purpose: string;
}

export interface Action {
  day: string;   // ISO date string or formatted date
  phase: string; // Phase name (key from `phases`)
  text: string;  // Short description
  anotherField?: string;
  schedule?: ScheduleItem[];
  mainThemes?: string[];
  roles?: string[];
  collaboration?: string;
}

export interface ScheduleItem {
  time: string;       // e.g., "09:00"
  duration: string;   // e.g., "00:30:00"
  theme: string;
  activity: string;
  facilitation: string;
}

const PHASE_COLORS = ['#cd5aff', '#8067ff', '#ef64ff', '#ff4b85'];

const getDayIndex = (dateStr: string, startDate: Date): number => {
  const date = parseISO(dateStr);
  return Math.floor((date.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
};

const getPhaseColor = (phaseName: string, palette: string[], phases: Record<string, Phase>): string => {
  const phaseNames = Object.keys(phases); // No Set or spread
  const phaseIndex = phaseNames.indexOf(phaseName);
  return palette[phaseIndex % palette.length] || 'gray';
};

const getActionsByDay = (actions: Record<string, Action>, startDate: Date) => {
  const map = new Map<number, [string, Action][]>();

  for (const [actionName, action] of Object.entries(actions)) {
    const dayIndex = getDayIndex(action.day, startDate);
    if (!map.has(dayIndex)) map.set(dayIndex, []);
    map.get(dayIndex)?.push([actionName, action]);
  }

  return map;
};

const generateScheduleDetails = (schedule: ScheduleItem[] | undefined) => {
  if (!schedule || !schedule.length) return <tspan>No schedule available</tspan>;

  return schedule.map((item, idx) => (
    <tspan key={idx} x="0%" dy="1.2em">
      {item.time} — {item.theme}
    </tspan>
  ));
};

const JourneyAgendas: React.FC = () => {
    const data: Journey = shapesData;
    const { start, end, phases, actions } = data;

    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    const radius = 250;

    const angleIncrement = 360 / totalDays; // Angle between each circle
    const actionsByDay = getActionsByDay(actions, startDate);
  
    const circles = Array.from({ length: totalDays }, (_, i) => {
      const actionsToday = actionsByDay.get(i) || [];
      const angleInRadians = (angleIncrement * i - 90) * (Math.PI / 180);
    
      if (actionsToday.length === 0) {
        const x = radius * Math.cos(angleInRadians);
        const y = radius * Math.sin(angleInRadians);
    
        return (
          <g key={`empty-${i}`} className="group">
            <circle
              cx={x}
              cy={y}
              r="5.5"
              fill="white"
              className="opacity-50 hover:opacity-100 transition"
            />
          </g>
        );
      }
    
      return actionsToday.map(([actionName, action], idx) => {
        const localRadius = radius + idx * 15;
        const x = localRadius * Math.cos(angleInRadians);
        const y = localRadius * Math.sin(angleInRadians);
        const phaseColor = getPhaseColor(action.phase, PHASE_COLORS, phases);
    
        return (
          <g key={`${i}-${idx}`} className="group">
            <circle
              cx={x}
              cy={y}
              r="5.5"
              fill={phaseColor}
              className="opacity-80 hover:opacity-100 transition"
            />
            <text
              x="0%"
              y="0%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="0.75rem"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <tspan fontWeight="bold">{actionName}</tspan>
              {generateScheduleDetails(action.schedule)}
            </text>
          </g>
        );
      });
    }).flat();
    
  
    return (
      <svg
        width={2 * radius + 50}
        height={2 * radius + 50}
        viewBox={`0 0 ${2 * radius + 50} ${2 * radius + 50}`}
        xmlns="http://www.w3.org/2000/svg"
        className='border-gray-500 border-2 w-full'
      >
        <g transform={`translate(${radius + 25}, ${radius + 25})`} className='relative'>
          {circles}
        </g>
      </svg>
    );
  };
  
export default JourneyAgendas;

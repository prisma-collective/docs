import shapesData from '@/data/agenda.json'; 
import { addDays, format, parseISO } from 'date-fns';

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
    const viewboxBuffer = 50;
    const svgSize = 2 * radius + viewboxBuffer;
    const dayCricleSize = 5;
    const dayCircleStackOffset = 15;

    const angleIncrement = 360 / totalDays; // Angle between each circle
    const actionsByDay = getActionsByDay(actions, startDate);
  
    const circles = Array.from({ length: totalDays }, (_, i) => {
      const actionsToday = actionsByDay.get(i) || [];
      const currentDate = addDays(startDate, i);
      const dayToday = format(currentDate, 'EEE d LLL'); // e.g. "Fri 25 Apr"
      const angleInRadians = (angleIncrement * i - 90) * (Math.PI / 180);
    
      if (actionsToday.length === 0) {
        const x = radius * Math.cos(angleInRadians);
        const y = radius * Math.sin(angleInRadians);
    
        return (
          <g key={`empty-${i}`} className="group">
            <circle
              cx={x}
              cy={y}
              r={dayCricleSize}
              fill="white"
              className="opacity-50 hover:opacity-100 transition"
            />
            <text
              x="0%"
              y="0%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              <tspan x="0%" className="font-custom-bold text-3xl">{dayToday}</tspan>
            </text>
          </g>
        );
      }
    
      return actionsToday.map(([actionName, action], idx) => {
        const localRadius = radius + idx * dayCircleStackOffset;
        const x = localRadius * Math.cos(angleInRadians);
        const y = localRadius * Math.sin(angleInRadians);
        const phaseColor = getPhaseColor(action.phase, PHASE_COLORS, phases);
    
        return (
          <g key={`${i}-${idx}`} className="group">
            <circle
              cx={x}
              cy={y}
              r={dayCricleSize}
              fill={phaseColor}
              className="opacity-90 hover:opacity-100 transition"
            />
            <text
              x="0%"
              y="-5%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="0.75rem"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              <tspan x="0%" className="font-custom-bold text-3xl">{dayToday}</tspan>
              <tspan x="0%" dy="2.5em" fontWeight="bold">{actionName}</tspan>
              {generateScheduleDetails(action.schedule)}
            </text>
          </g>
        );
      });
    }).flat();
    
  
    return (
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className='border-gray-500 border-2 w-full'
      >
        <g transform={`translate(${radius + viewboxBuffer/2}, ${radius + viewboxBuffer/2})`} className='relative'>
          {circles}
        </g>
      </svg>
    );
  };
  
export default JourneyAgendas;

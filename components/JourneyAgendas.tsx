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

const JourneyAgendas: React.FC = () => {
    const data: Journey = shapesData;
    const { start, end, phases, actions } = data;

    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    const radius = 250;

    const angleIncrement = 360 / totalDays; // Angle between each circle
  
    // Generate the circles
    const circles = Array.from({ length: totalDays }, (_, i) => {
      // Calculate angle in radians
      const angleInRadians = (angleIncrement * i) * (Math.PI / 180);
  
      // Calculate x and y positions on the circumference
      const xPosition = radius * Math.cos(angleInRadians); // Center the circle
      const yPosition = radius * Math.sin(angleInRadians); // Center the circle
  
      return (
        <circle
          key={i}
          cx={xPosition}
          cy={yPosition}
          r="6" // Radius of the individual day circle
          fill="red"
          stroke="black"
          strokeWidth="2"
          className='fill-white/30 hover:fill-prisma-a'
        >
          <text
            x={xPosition}
            y={yPosition}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            fontSize="12px"
            fontWeight="bold"
          >
            {i + 1} {/* Day number */}
          </text>
        </circle>
      );
    });
  
    return (
      <svg
        width={2 * radius + 50}
        height={2 * radius + 50}
        viewBox={`0 0 ${2 * radius + 50} ${2 * radius + 50}`}
        xmlns="http://www.w3.org/2000/svg"
        className='border-white border-2 w-full'
      >
        <g transform={`translate(${radius + 25}, ${radius + 25})`}>
          {circles}
        </g>
      </svg>
    );
  };
  
export default JourneyAgendas;

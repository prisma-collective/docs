'use client';

import { useState, useMemo } from 'react';

interface TeamData {
  'Team name': string;
  'Hub association': string;
  'Main link': string;
  'Problem statement': string;
  dominant_category: string;
  [key: string]: string | number;
}

export default function ProjectClusterViewer({ teams }: { teams: TeamData[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dynamically extract category columns (numeric columns)
  const categoryColumns = useMemo(() => {
    if (teams.length === 0) return [];
    const firstTeam = teams[0];
    const allColumns = Object.keys(firstTeam);
    
    // Get columns that are numeric (categories are float values 0-1); exclude empty headers
    return allColumns.filter(col => 
      typeof firstTeam[col] === 'number' && 
      col !== 'dominant_category' &&
      String(col).trim() !== ''
    );
  }, [teams]);

  // Sort and filter teams based on selected category
  const displayedTeams = useMemo(() => {
    if (selectedCategory === 'all') {
      // Show all teams with their dominant category
      return teams;
    }
    
    // Filter teams where this is the dominant category and sort by score
    const filtered = teams.filter(t => t.dominant_category === selectedCategory);
    return filtered.sort((a, b) => {
      const aValue = typeof a[selectedCategory] === 'number' ? a[selectedCategory] : 0;
      const bValue = typeof b[selectedCategory] === 'number' ? b[selectedCategory] : 0;
      return (bValue as number) - (aValue as number);
    });
  }, [teams, selectedCategory]);

  return (
    <div className="my-8 text-inherit">
      {/* Category Filter */}
      <div className="mb-4">
        <label htmlFor="category-select" className="mr-2 font-medium text-inherit">
          Filter by category:
        </label>
        <select 
          id="category-select"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        >
          <option value="all">All Categories (Dominant)</option>
          {categoryColumns.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {selectedCategory !== 'all' && (
          <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
            <br />
            <br />
            {displayedTeams.length} teams
          </span>
        )}
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-collapse border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-inherit">Team Name</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-inherit">Hub</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-inherit">Problem statement</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-inherit">Correlation</th>
            </tr>
          </thead>
          <tbody>
            {displayedTeams.map((team, idx) => {
              const categoryToShow = selectedCategory === 'all' 
                ? team.dominant_category 
                : selectedCategory;
              const score = team[categoryToShow];
              const scoreValue = typeof score === 'number' ? score : 0;
              const percentage = scoreValue * 100;
              const mainLink = team['Main link'] && String(team['Main link']).trim();
              const circumference = 2 * Math.PI * 9;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;
              
              return (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-inherit">
                    <div className="flex items-center gap-2">
                      {mainLink ? (
                        <a
                          href={mainLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-gray-500 dark:text-gray-400 transition-colors"
                          aria-label={`Open ${team['Team name']} link`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </a>
                      ) : null}
                      <span>{team['Team name']}</span>
                    </div>
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-inherit">{team['Hub association']}</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-inherit text-sm max-w-md">
                    {team['Problem statement'] || '—'}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-inherit">
                    <div className="flex items-center justify-between gap-3">
                      <div className="shrink-0">
                        <svg width="28" height="28" className="-rotate-90" aria-hidden>
                          <circle
                            cx="14"
                            cy="14"
                            r="9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-gray-100 dark:text-gray-800"
                          />
                          <circle
                            cx="14"
                            cy="14"
                            r="9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-prisma-d dark:text-prisma-d transition-all duration-300"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-inherit shrink-0">{percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
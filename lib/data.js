import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export function getTeamsData() {
  const filePath = path.join(process.cwd(), 'data', 'events', 'summit', 'projects_cluster_weightages.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = Papa.parse(fileContent, { 
    header: true,
    dynamicTyping: true // Converts numeric strings to numbers
  });
  return data;
}
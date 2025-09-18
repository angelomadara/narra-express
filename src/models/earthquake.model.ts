export interface Earthquake {
  id?: number;
  magnitude: number;
  location: string;
  depth: number;
  date_time: Date;
  latitude?: number;
  longitude?: number;
  source?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EarthquakeFilters {
  minMagnitude?: number;
  maxMagnitude?: number;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
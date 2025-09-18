export interface CreateEarthquakeDTO {
  magnitude: number;
  location: string;
  depth: number;
  date_time: string | Date;
  latitude?: number;
  longitude?: number;
  source?: string;
}

export interface UpdateEarthquakeDTO {
  magnitude?: number;
  location?: string;
  depth?: number;
  date_time?: string | Date;
  latitude?: number;
  longitude?: number;
  source?: string;
}

export interface EarthquakeResponseDTO {
  id: number;
  magnitude: number;
  location: string;
  depth: number;
  date_time: Date;
  latitude?: number;
  longitude?: number;
  source?: string;
  created_at: Date;
  updated_at: Date;
}

export interface EarthquakeQueryDTO {
  minMagnitude?: string;
  maxMagnitude?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  page?: string;
}
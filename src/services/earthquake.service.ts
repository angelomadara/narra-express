import { pool } from '../config/database';
import { Earthquake, EarthquakeFilters } from '../models/earthquake.model';
import { CreateEarthquakeDTO, UpdateEarthquakeDTO } from '../dto/earthquake.dto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class EarthquakeService {
  
  async createEarthquake(data: CreateEarthquakeDTO): Promise<Earthquake> {
    const query = `
      INSERT INTO earthquakes (magnitude, location, depth, date_time, latitude, longitude, source)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute<ResultSetHeader>(query, [
      data.magnitude,
      data.location,
      data.depth,
      data.date_time,
      data.latitude || null,
      data.longitude || null,
      data.source || null
    ]);

    return this.getEarthquakeById(result.insertId);
  }

  async getAllEarthquakes(filters: EarthquakeFilters = {}): Promise<Earthquake[]> {
    let query = 'SELECT * FROM earthquakes WHERE 1=1';
    const params: any[] = [];

    if (filters.minMagnitude) {
      query += ' AND magnitude >= ?';
      params.push(filters.minMagnitude);
    }

    if (filters.maxMagnitude) {
      query += ' AND magnitude <= ?';
      params.push(filters.maxMagnitude);
    }

    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.startDate) {
      query += ' AND date_time >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND date_time <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY date_time DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows as Earthquake[];
  }

  async getEarthquakeById(id: number): Promise<Earthquake> {
    const query = 'SELECT * FROM earthquakes WHERE id = ?';
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    
    if (rows.length === 0) {
      throw new Error('Earthquake not found');
    }
    
    return rows[0] as Earthquake;
  }

  async updateEarthquake(id: number, data: UpdateEarthquakeDTO): Promise<Earthquake> {
    const fields: string[] = [];
    const params: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    params.push(id);

    const query = `UPDATE earthquakes SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(query, params);

    return this.getEarthquakeById(id);
  }

  async deleteEarthquake(id: number): Promise<void> {
    const query = 'DELETE FROM earthquakes WHERE id = ?';
    const [result] = await pool.execute<ResultSetHeader>(query, [id]);
    
    if (result.affectedRows === 0) {
      throw new Error('Earthquake not found');
    }
  }

  async getEarthquakeCount(filters: EarthquakeFilters = {}): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM earthquakes WHERE 1=1';
    const params: any[] = [];

    if (filters.minMagnitude) {
      query += ' AND magnitude >= ?';
      params.push(filters.minMagnitude);
    }

    if (filters.maxMagnitude) {
      query += ' AND magnitude <= ?';
      params.push(filters.maxMagnitude);
    }

    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.startDate) {
      query += ' AND date_time >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND date_time <= ?';
      params.push(filters.endDate);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return (rows[0] as any).count;
  }
}
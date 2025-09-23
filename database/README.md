# Database Setup

## Prerequisites
- MySQL server running on localhost
- Username: root
- Password: 12345678

## Setup Instructions

1. **Automatic Setup (Recommended)**
   ```bash
   npm run setup-db
   ```

2. **Manual Setup**
   - Connect to MySQL as root
   - Run the SQL commands in `schema.sql`

## Project Structure
```
src/
├── config/
│   └── database.ts          # MySQL connection configuration
├── models/
│   └── earthquake.model.ts  # TypeScript interfaces/models
├── dto/
│   └── earthquake.dto.ts    # Data Transfer Objects
├── services/
│   └── earthquake.service.ts # Database operations layer
└── controllers/
    └── earthquake.controller.ts # Updated controller with CRUD operations

database/
├── schema.sql              # Database schema
└── README.md              # Database documentation

scripts/
└── setup-db.js            # Database setup script
```

## Database Schema

### earthquakes table
- `id` - Primary key (auto increment)
- `magnitude` - Earthquake magnitude (DECIMAL 3,1)
- `location` - Location description (VARCHAR 255)
- `depth` - Depth in kilometers (DECIMAL 6,2)
- `date_time` - Date and time of earthquake (DATETIME)
- `latitude` - Latitude coordinate (DECIMAL 10,8)
- `longitude` - Longitude coordinate (DECIMAL 11,8)
- `source` - Data source (VARCHAR 100)
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

## API Endpoints

### GET /api/earthquakes
Get all earthquakes with optional filtering:
- `minMagnitude` - Filter by minimum magnitude
- `maxMagnitude` - Filter by maximum magnitude
- `location` - Filter by location (partial match)
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `limit` - Number of records per page (default: 10)
- `page` - Page number (default: 1)

### GET /api/earthquakes/:id
Get specific earthquake by ID

### POST /api/earthquakes
Create new earthquake record

### PUT /api/earthquakes/:id
Update existing earthquake record

### DELETE /api/earthquakes/:id
Delete earthquake record

### GET /api/earthquakes/stats
Get earthquake statistics
### To setup database configuration
1. Open the `.env` file in the root directory of the project.
2. Locate the section labeled `# Database Configuration`.
3. Update the following variables with your database details:
   - `DB_HOST`: Set this to your database host (e.g., `localhost`).
   - `DB_USER`: Set this to your database username (e.g., `root`).
   - `DB_PASSWORD`: Set this to your database password (e.g., `your-database-password`).
   - `DB_NAME`: Set this to your desired database name (e.g., `your-database-name`).
   - `DB_PORT`: Set this to your database port number (e.g., `3306` for MySQL).
4. Save the `.env` file.

### To create the database
1. Ensure you have MySQL server running on your machine.
2. Open a terminal and navigate to the root directory of the project.
3. Run the following command to execute the database setup script:
   ```
   npm run setup-db
   ```
4. The script will connect to the MySQL server and create the database specified in the `.env` file.

## Patch version
(updates 1.0.0 → 1.0.1)
```
npm version patch
```

## Minor version
(updates 1.0.0 → 1.1.0)
```
npm version minor
```

## Major version
(updates 1.0.0 → 2.0.0)
```
npm version major
```
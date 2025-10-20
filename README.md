# Narra Express

> Express.js MVC boilerplate with TypeScript, Authentication, and Database support

## 🚀 Quick Start

Create a new Narra Express app:

```bash
npx narra-express my-app
cd my-app
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**That's it!** Your Express.js API with MVC structure is ready at `http://localhost:3000`

## 📖 Full Documentation

See [Create Narra App Guide](docs/CREATE_NARRA_APP.md) for detailed setup instructions and alternative installation methods.

---

## Narra Express API

# DATABASE
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

# APPLICATION
### To run the application
1. Open a terminal and navigate to the root directory of the project.
2. Install the project dependencies by running:
   ```
   npm install
   ```
3. Start the application with the following command:
   ```
   npm run dev
   ```
4. The server should now be running, and you can access it at `http://localhost:3000` (or the port specified in your `.env` file).

### To test the application
1. Use a tool like Postman or cURL to send requests to the API endpoints.
2. Refer to the API documentation for details on available endpoints and request formats.

# AUTHENTICATION
### This project uses JWT (JSON Web Tokens) for authentication.
1. To access protected routes, you need to include a valid JWT in the `Authorization` header of your requests.
2. The token should be in the format: `Bearer <your-token-here>`.
3. You can generate a JWT using the `/auth/login` endpoint (if implemented) or through your own authentication mechanism.
4. Ensure that the JWT secret key is set in the `.env` file under the `JWT_SECRET` variable.

(See auth.controller.ts, auth.middleware.ts, and auth.route.ts for reference)

# MIDDLEWARE
### This project uses middleware for various purposes, including validation, authentication, csrf, and rate limiting.
1. Authentication Middleware: Protects routes by verifying JWT tokens.
2. Validation Middleware: Validates request data against defined schemas.
3. CSRF Middleware: Protects against Cross-Site Request Forgery attacks.
4. Rate Limiting Middleware: Limits the number of requests from a single IP address to prevent abuse.
5. You can find the middleware implementations in the `src/middleware` directory.

# LOGGING
### This project using a persistent logging mechanism with log rotation.
1. Log files are stored in the `logs` directory at the root of the project.
2. Log files are rotated daily, and old log files are retained for a configurable number of days (default is 60 days).
3. You can configure the logging settings in the `.env` file.

### To use the logging feature for testing purposes
1. Start the application as described above.
2. Send a GET request to the `/example/logs` endpoint:
   ```
   GET http://localhost:3000/example/logs
   ```
3. This will trigger various log messages (info, warn, error, transaction, trace, fatal).
4. Check the console output and the log files in the `logs` directory to see the generated log messages.


# Versioning
### Patch version
(updates 1.0.0 → 1.0.1)
```
npm version patch
```

### Minor version
(updates 1.0.0 → 1.1.0)
```
npm version minor
```

### Major version
(updates 1.0.0 → 2.0.0)
```
npm version major
```
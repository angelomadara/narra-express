# Create Narra App

Create Express.js applications with TypeScript, authentication, and MVC structure.

## Quick Start

### Method 1: NPX (Recommended)
```bash
# Create a new project
npx narra-express my-app
cd my-app

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies (already done by npx)
npm install

# Start development
npm run dev
```

### Method 2: Manual Download
```bash
# Download and extract template files
npm pack narra-express
tar -xzf narra-express-*.tgz
mv package/* ./
rm -rf package/ narra-express-*.tgz

# Install dependencies
npm install

# Setup environment  
cp .env.example .env
# Edit .env with your database credentials

# Start development
npm run dev
```

### Method 3: Git Clone (Alternative)
```bash
git clone https://github.com/angelomadara/narra-express.git my-app
cd my-app
rm -rf .git
npm install
cp .env.example .env
npm run dev
```

## What's Included

### 🏗️ **MVC Structure**
- **Controllers**: Handle HTTP requests and responses
- **Models**: Database entities and relationships  
- **Services**: Business logic and data operations
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, validation, CSRF protection

### 🔐 **Authentication & Security**
- JWT access & refresh tokens
- Password hashing with bcrypt
- CSRF protection
- Rate limiting
- Input validation
- XSS protection with Helmet

### 🗄️ **Database Support** 
- **MySQL** with TypeORM
- **MongoDB** with native driver
- Database migrations and seeding
- Connection pooling

### 📧 **Additional Features**
- Email service (password reset)
- Logging system with rotation
- API documentation examples
- Environment configuration
- TypeScript configuration

## Folder Structure

```
my-app/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── types/          # TypeScript definitions
├── database/           # Schema and migrations
├── scripts/            # Setup and utility scripts
├── docs/              # Documentation
├── http/              # API testing files
├── .env.example       # Environment template
└── package.json       # Dependencies and scripts
```

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build TypeScript to JavaScript  
npm start          # Start production server
npm run setup-db   # Create database and tables
```

## Configuration

1. **Database**: Update `.env` with your database credentials
2. **JWT**: Generate secure secrets for JWT tokens
3. **Email**: Configure SMTP for password reset emails
4. **Logging**: Set log level and retention options

## Next Steps

1. **Read Documentation**: Check the `docs/` folder for detailed guides
2. **Test API**: Use files in `http/` folder with REST client
3. **Customize**: Modify controllers, models, and routes for your needs
4. **Deploy**: Build and deploy to your preferred platform

## Support

- 📖 **Documentation**: `/docs` folder
- 🐛 **Issues**: [GitHub Issues](https://github.com/angelomadara/narra-express/issues)  
- 💬 **Discussions**: [GitHub Discussions](https://github.com/angelomadara/narra-express/discussions)

---

**Happy coding!** 🚀
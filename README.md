# 🐛 BugVault

A full-stack developer issue tracker with MongoDB backend. Store bugs, errors, and solutions with powerful search, filtering, and organization features.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 🎯 Why BugVault?

Ever fixed a bug and forgotten the solution six months later? BugVault is your personal knowledge base for every error and fix you encounter. Now with MongoDB for persistence, search, and scalability.

### 🔒 Security-First Design
- **Input Sanitization:** All inputs sanitized with DOMPurify to prevent XSS
- **Rate Limiting:** Protection against DoS attacks (100 req/15min per IP)
- **Security Headers:** Helmet.js for CSP, X-Frame-Options, and more
- **CORS Protection:** Configurable allowed origins
- **Zero Vulnerabilities:** All dependencies audited and up-to-date

See [SECURITY.md](SECURITY.md) for security policy and [AUDIT.md](AUDIT.md) for the full security audit.

## ✨ Features

### Core Functionality
- **📝 Quick Capture** — Log issues with error messages, context, and solutions
- **🔍 Full-Text Search** — Instant MongoDB text search with highlighted results
- **🏷️ Smart Filtering** — Filter by project, tags, or date range
- **📦 RESTful API** — Clean API for all CRUD operations
- **🎨 Dark Theme** — Easy on the eyes during late-night debugging

### Organization
- **📌 Pin Issues** — Keep important bugs at the top
- **📋 Bulk Operations** — Select and manage multiple issues at once
- **🔖 Advanced Filtering** — Complex queries with pagination and sorting

### Data Management
- **💾 MongoDB Storage** — Persistent, scalable database
- **📥 Import/Export** — Full JSON backup for portability
- **🐳 Docker Ready** — One command to run the entire stack
- **🔄 Seed Data** — Import sample bugs to get started

### Markdown Support
Write solutions with basic markdown:
- **bold**, *italic*, `inline code`
- Code blocks for snippets
- Clickable links

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/tahseen137/bugvault.git
cd bugvault

# Start the entire stack (MongoDB + App)
docker-compose up

# Optional: Seed with sample data
docker-compose exec app npm run seed
```

Visit **http://localhost:3000** 🎉

### Option 2: Local Development

**Prerequisites:** Node.js 18+ and MongoDB 7+

```bash
# Clone the repository
git clone https://github.com/tahseen137/bugvault.git
cd bugvault

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start MongoDB (if not running)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# Seed the database (optional)
npm run seed

# Start the server
npm start
```

Visit **http://localhost:3000** 🎉

## 📋 API Endpoints

### Bugs
- `GET /api/bugs` — List all bugs (with filters, search, pagination)
- `GET /api/bugs/:id` — Get single bug
- `POST /api/bugs` — Create new bug
- `PUT /api/bugs/:id` — Update bug
- `DELETE /api/bugs/:id` — Delete bug
- `POST /api/bugs/bulk-delete` — Bulk delete bugs

### Metadata
- `GET /api/bugs/meta/projects` — List unique projects
- `GET /api/bugs/meta/tags` — List unique tags

### Import/Export
- `POST /api/bugs/import` — Import bugs from JSON
- `GET /api/bugs/export/all` — Export all bugs as JSON

### System
- `GET /api/health` — Health check endpoint

### Query Parameters (GET /api/bugs)

```
?search=error          # Full-text search
?project=my-app        # Filter by project
?tags=react,api        # Filter by tags
?dateFrom=2025-01-01   # Filter by created date
?dateTo=2025-12-31     # Filter by created date
?sort=newest           # Sort: newest, oldest, title
?limit=50              # Pagination limit
?offset=0              # Pagination offset
```

## 💡 Usage

### Logging an Issue
1. Click **+ New Issue**
2. Fill in details:
   - **Title** — Brief description (required)
   - **Error Message** — Stack trace or error output
   - **Solution** — How you fixed it (supports markdown)
   - **Project** — Group related issues
   - **Tags** — Keywords like `react`, `api`, `auth`
   - **Context** — Additional notes or links
3. Click **Save Issue**

### Bulk Operations
1. Click **Select** button
2. Check issues to select
3. Choose action: **Delete**, **Change Project**, or **Add Tags**

### Import/Export
- **Export:** Click **Export** to download all bugs as JSON
- **Import:** Click **Import** and select a JSON file (merges with existing data)

### Seeding Sample Data
The project includes `sample-bugs.json` with 25 realistic developer issues:

```bash
# Using Docker
docker-compose exec app npm run seed

# Local development
npm run seed
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** — RESTful API server
- **MongoDB** + **Mongoose** — Database and ODM
- **express-validator** — Input validation

### Frontend
- **Vanilla JavaScript** — No frameworks, just clean code
- **Modern CSS** — CSS Grid, Flexbox, custom properties
- **Fetch API** — RESTful API communication

### DevOps
- **Docker** + **docker-compose** — Containerization
- **Health checks** — Built-in monitoring

## 📁 Project Structure

```
bugvault/
├── models/                 # Mongoose schemas
│   └── Bug.js
├── routes/                 # Express routes
│   └── bugs.js
├── public/                 # Frontend files
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── server.js               # Express server
├── seed.js                 # Database seeding script
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── sample-bugs.json        # Sample data
├── legacy-index.html       # Original localStorage version
└── README.md
```

## 🐳 Docker Configuration

### Services
- **mongo** — MongoDB 7 database (port 27017)
- **app** — BugVault application (port 3000)

### Volumes
- `mongo_data` — Persistent MongoDB storage

### Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Clean everything (removes volumes)
docker-compose down -v

# Rebuild containers
docker-compose build
```

## 🔧 Environment Variables

Create a `.env` file (see `.env.example`):

```env
MONGO_URI=mongodb://mongo:27017/bugvault
PORT=3000
NODE_ENV=development
```

## 🧪 Development

### Running Locally
```bash
# Install dependencies
npm install

# Start with auto-reload
npm run dev

# Seed database
npm run seed
```

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Create bug
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Bug",
    "error": "Error message here",
    "project": "test-project",
    "tags": ["test"]
  }'

# List bugs
curl http://localhost:3000/api/bugs?limit=10
```

## 📊 Data Model

### Bug Schema
```javascript
{
  title: String (required),
  error: String,
  context: String,
  solution: String,
  project: String,
  tags: [String],
  pinned: Boolean,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- Full-text search on `title`, `error`, `solution`
- Index on `project` for fast filtering
- Index on `tags` for tag queries
- Compound index on `pinned` + `createdAt` for sorting

## 🤝 Contributing

Found a bug? (Ironic, right?) Open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔄 Migration from v1.0 (localStorage)

The original single-file version is preserved as `legacy-index.html`. To migrate your data:

1. Export data from the old version (click Export)
2. Start the new MongoDB version
3. Click Import and select your JSON file
4. All your bugs will be imported! 🎉

## 🚀 Deployment

### Docker Deployment
```bash
# Set production environment
export NODE_ENV=production

# Update MONGO_URI in .env to your production MongoDB

# Start services
docker-compose up -d
```

### Cloud Deployment (Example: Railway, Render, Fly.io)
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGO_URI` — Your MongoDB connection string (e.g., MongoDB Atlas)
   - `PORT` — 3000 (or platform default)
   - `NODE_ENV` — production
3. Deploy!

## 🙏 Acknowledgments

Built with ☕ by developers, for developers. Keep track of your bugs before they track you down.

**Version 2.0** — Now with MongoDB, RESTful API, and Docker support!

---

**[Star this repo](https://github.com/tahseen137/bugvault)** if you find it useful!

# Resume AI API

A RESTful API built with Express.js and TypeScript for managing resumes with AI-powered features including analysis, enhancement, and job matching capabilities.

## Features

- **CRUD Operations**: Create, read, update, and delete resumes
- **AI Analysis**: Analyze resume content for strengths and improvements
- **AI Enhancement**: Enhance resume content with AI suggestions
- **Job Matching**: Match resumes to job descriptions
- **Security**: Built-in security with Helmet, CORS, and rate limiting
- **Validation**: Request validation middleware
- **Health Check**: API health monitoring endpoint

## Getting Started

### Installation

Dependencies have already been installed. If you need to reinstall:

```bash
npm install
```

### Building the Project

Build the TypeScript source to JavaScript:

```bash
npm run build
```

### Running the Server

Development mode (with auto-restart using ts-node):
```bash
npm run dev
```

Production mode (requires build first):
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` by default.

### API Endpoints

#### Health Check
- `GET /health` - Check API health status

#### Resume Management
- `GET /api/resume` - Get all resumes (with pagination and search)
- `GET /api/resume/:id` - Get resume by ID
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume by ID
- `DELETE /api/resume/:id` - Delete resume by ID

#### AI Features
- `POST /api/resume/analyze` - Analyze resume content
- `POST /api/resume/enhance` - AI-enhance resume content
- `POST /api/resume/match-job` - Match resume to job description

### Example Requests

#### Create a Resume
```json
POST /api/resume
{
  "name": "John Doe",
  "email": "john@example.com",
  "title": "Software Engineer",
  "summary": "Experienced developer...",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [...],
  "education": [...]
}
```

#### Analyze Resume
```json
POST /api/resume/analyze
{
  "resumeContent": "Your resume content here..."
}
```

#### Match Job Description
```json
POST /api/resume/match-job
{
  "resumeContent": "Your resume content here...",
  "jobDescription": "Job description text here..."
}
```

### Project Structure

```
resume-ai-api/
├── src/                    # TypeScript source code
│   ├── server.ts          # Main server file
│   ├── config.ts          # Configuration settings
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── controllers/       # Request handlers
│   │   └── resumeController.ts
│   ├── routes/            # API routes
│   │   └── api.ts
│   ├── middleware/        # Custom middleware
│   │   └── validation.ts
│   ├── models/            # Data models (for future use)
│   └── utils/             # Utility functions
├── dist/                  # Compiled JavaScript (generated)
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest testing configuration
└── nodemon.json          # Nodemon configuration
```

### Configuration

Create a `.env` file in the root directory with your environment variables (see `.env.example` for all available options):

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Request validation middleware
- **TypeScript**: Type safety and better development experience

### Development

Run tests:
```bash
npm test
```

Build and start development server:
```bash
npm run build
npm run dev
```

### TypeScript Features

This project uses TypeScript with strict type checking for:
- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support and autocompletion
- **Interface Definitions**: Clear API contracts and data structures
- **Validation**: Type-safe request/response handling

The API includes mock data and AI responses for development. In production, you'll want to:
1. Connect to a real database
2. Integrate with actual AI services (OpenAI, Anthropic, etc.)
3. Add authentication and authorization
4. Implement file upload capabilities

## 🌐 Frontend Integration

Ready to build a frontend? Check out our comprehensive **[Frontend Integration Guide](./FRONTEND_INTEGRATION.md)** that includes:

- **Complete TypeScript interfaces**
- **React and Vue.js examples** 
- **Chat component implementations**
- **Error handling best practices**
- **Live HTML demo** (`examples/chat-example.html`)

### Quick Test
Open `examples/chat-example.html` in your browser for an instant chat demo with Elevatr!

### Next Steps

1. Set up a database (MongoDB, PostgreSQL, etc.)
2. Integrate AI services for real analysis
3. Add user authentication
4. Implement file upload for resume documents  
5. Add comprehensive testing with TypeScript
6. Set up CI/CD pipeline

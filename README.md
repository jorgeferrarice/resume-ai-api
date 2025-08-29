# 🚀 Resume AI API

> ## 🌐 **LIVE DEMO**
> **Try it now at: https://resume-ai-web.onrender.com** ✨
> 
> *A fully functional recruiting AI assistant built with Express.js, TypeScript, and OpenAI*

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/2486h.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

---

## 🎯 **What This Project Does**

**Resume AI API** is a recruiting-focused AI assistant called **Elevatr** that helps HR professionals and recruiters evaluate candidates. Built specifically to assess Jorge Ferrari as a candidate, it provides:

- 🤖 **AI-Powered Candidate Assessment** - Chat with Elevatr to understand candidate strengths, weaknesses, and fit
- 📊 **Resume Analysis** - Technical skill evaluation, experience review, and cultural fit assessment  
- 🎯 **Job Matching** - Determine how well a candidate aligns with specific roles
- 💬 **Conversational Interface** - Natural language interactions for recruiting insights
- 🔍 **Contextual Understanding** - Leverages detailed candidate background for personalized assessments

## 🛠 **Technologies Used**

### **Backend Stack**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Static typing and enhanced development experience
- **OpenAI API** - AI-powered candidate insights and natural language processing

### **Key Libraries & Tools**
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers and protection
- **Morgan** - HTTP request logging
- **Express Rate Limit** - API rate limiting and abuse prevention
- **UUID** - Unique identifier generation for conversations
- **Dotenv** - Environment variable management

### **Development Tools**
- **ts-node** - TypeScript execution for development
- **Nodemon** - Automatic server restart during development  
- **Jest** - Testing framework
- **TSC** - TypeScript compiler

## 🚀 **What's Implemented**

### **Core Features**
✅ **Elevatr AI Chat** - Conversational recruiting assistant with personality  
✅ **Candidate Assessment** - Technical skills, cultural fit, and potential evaluation  
✅ **Resume CRUD Operations** - Complete resume management system  
✅ **AI Analysis Engine** - Resume content analysis and enhancement  
✅ **Job Matching** - Candidate-to-role alignment scoring  
✅ **Conversation Management** - Persistent chat history and context  
✅ **Security Layer** - Rate limiting, CORS, security headers  
✅ **Type Safety** - Full TypeScript implementation with strict typing  
✅ **Mock AI Responses** - Functional without OpenAI API key  

### **Architecture Features**
- **RESTful API Design** - Clean, predictable endpoint structure
- **Modular Code Organization** - Services, controllers, middleware separation
- **Environment Configuration** - Flexible deployment settings
- **Error Handling** - Comprehensive error catching and reporting
- **Request Validation** - Input sanitization and validation middleware
- **Health Monitoring** - API status and health check endpoints

## 🎮 **Getting Started**

### **Quick Start**
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### **API Endpoints**

#### **🤖 Elevatr Chat (Main Feature)**
- `POST /api/chat` - Chat with Elevatr recruiting AI about candidates
- `GET /api/chat/:conversationId` - Get conversation history
- `DELETE /api/chat/:conversationId` - Delete conversation

#### **📊 Resume Management** 
- `GET /api/resume` - Get all resumes
- `GET /api/resume/:id` - Get resume by ID
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

#### **🧠 AI Analysis**
- `POST /api/resume/analyze` - Analyze resume content
- `POST /api/resume/enhance` - AI-enhance resume content
- `POST /api/resume/match-job` - Match resume to job description
- `POST /api/resume/suggestions` - Get custom AI suggestions

#### **🔧 System**
- `GET /health` - API health status
- `GET /api` - Available endpoints documentation

## 💬 **How to Use Elevatr**

### **Chat with the Recruiting AI**
```bash
# Ask about Jorge as a candidate
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What can you tell me about Jorge as a candidate?"}'

# Follow up questions in same conversation
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How are his leadership skills?", "conversationId": "your-conversation-id"}'
```

### **Example Questions to Ask Elevatr**
- *"What can you tell me about Jorge as a candidate?"*
- *"How do Jorge's technical skills align with senior dev roles?"*
- *"What are Jorge's strengths for team leadership?"*
- *"Is Jorge a good cultural fit for a tech startup?"*
- *"How does Jorge's experience with React make him suitable for this role?"*

### **Resume Analysis**
```bash
# Analyze resume content
curl -X POST http://localhost:3000/api/resume/analyze \
  -H "Content-Type: application/json" \
  -d '{"resumeContent": "Jorge Ferrari - Senior Full Stack Developer..."}'
```

## 📁 **Project Structure**

```
resume-ai-api/
├── src/                           # TypeScript source code
│   ├── server.ts                 # Express server setup and middleware
│   ├── config.ts                 # Environment configuration
│   ├── types/index.ts            # TypeScript interfaces and types
│   ├── controllers/              # Request handlers
│   │   ├── resumeController.ts   # Resume CRUD operations
│   │   └── chatController.ts     # Elevatr chat endpoints
│   ├── services/                 # Business logic
│   │   ├── openaiService.ts      # OpenAI API integration
│   │   ├── chatService.ts        # Elevatr personality and logic
│   │   └── conversationService.ts # Chat history management
│   ├── routes/api.ts             # API route definitions
│   ├── middleware/validation.ts  # Request validation
│   └── lib/                      # Context files
│       ├── personal-context.md   # Jorge's personal background
│       └── professional-context.md # Jorge's professional history
├── examples/                     # Frontend integration examples
│   ├── chat-example.html         # Live chat demo
│   └── README.md                 # Examples documentation
├── dist/                         # Compiled JavaScript (auto-generated)
└── Configuration files...
```

## ⚙️ **Configuration**

### **Environment Variables**
Create a `.env` file:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# OpenAI Integration (optional - uses mocks without this)
OPEN_API_KEY=your-openai-api-key-here
```

### **NPM Scripts**
```bash
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server (requires build)
npm run dev        # Start development server with auto-reload
npm run test       # Run test suite  
npm run clean      # Clean compiled output
npm run demo       # Open chat demo in browser
```

## 🔒 **Security & Quality**

- **🛡️ Helmet** - Security headers and attack prevention
- **🌐 CORS** - Configurable cross-origin resource sharing  
- **⚡ Rate Limiting** - API abuse prevention (15 requests/15 minutes)
- **✅ Input Validation** - Request sanitization and validation
- **🔍 TypeScript** - Compile-time error catching and type safety
- **📝 Error Logging** - Comprehensive error tracking with Morgan

## 🎨 **Elevatr Personality**

Elevatr is designed as a **fun, nerdy AI recruiting assistant** that:
- 🤓 Makes tech references and programming jokes
- 🎮 Drops gaming and sci-fi citations when appropriate  
- 💫 Maintains professional recruiting focus
- 🎯 Provides actionable candidate insights
- 🚀 Helps recruiters make informed hiring decisions

**Sample Interaction:**
> **Recruiter:** "What can you tell me about Jorge as a candidate?"
> 
> **Elevatr:** "👾 Jorge demonstrates mastery in full-stack development with 20+ years of experience! His journey from PHP to React shows incredible adaptability - talk about a full-stack evolution! 🚀"

## 🌐 **Try It Live**

- **Live Demo:** https://resume-ai-web.onrender.com
- **Local Chat Demo:** Open `examples/chat-example.html` in your browser
- **API Documentation:** Visit `/api` endpoint for complete documentation

## 🔮 **What Makes This Special**

Unlike typical resume APIs, this project:

- 🎯 **Recruiting-Focused** - Built specifically to help recruiters assess candidates
- 🤖 **AI Personality** - Elevatr has a distinctive, engaging personality while remaining professional  
- 📊 **Contextual Intelligence** - Uses detailed candidate background for personalized insights
- 💬 **Conversational** - Natural language interactions, not just REST endpoints
- 🛠️ **Production-Ready** - Full TypeScript, security, validation, and error handling
- 🎮 **Interactive Demo** - Live HTML demo shows real functionality
- 🔄 **Graceful Fallbacks** - Works with or without OpenAI API key

## 🚀 **Getting Started Locally**

```bash
# Clone and setup
git clone <repository-url>
cd resume-ai-api
npm install

# Start development
npm run dev

# Test it works
curl http://localhost:3000/health

# Chat with Elevatr
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Jorge as a candidate"}'
```

## 🎉 **Ready to Use**

This API is **production-ready** and includes everything you need:
- ✅ Full TypeScript implementation  
- ✅ Security and rate limiting
- ✅ Error handling and validation
- ✅ Interactive chat functionality
- ✅ Live demo and documentation
- ✅ Mock responses for development
- ✅ Comprehensive project structure

**Perfect for:**
- HR departments evaluating candidates
- Recruiting agencies assessing fit  
- Technical interviews and screening
- Portfolio demonstrations
- Learning TypeScript + Express.js patterns

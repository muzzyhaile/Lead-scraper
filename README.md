# Prospect Finder 🎯

> AI-powered B2B lead generation platform that automates prospect discovery, enrichment, and CRM management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)

## ✨ Features

- **🤖 AI-Powered ICP Builder** - Define your Ideal Customer Profile using Gemini AI
- **🗺️ Google Maps Integration** - Discover real businesses with verified contact data
- **🔍 Smart Lead Enrichment** - Automatically enrich leads with web crawling (Tavily API)
- **📊 Visual Pipeline** - Kanban-style CRM board with deal tracking
- **📞 Integrated Call Mode** - Make calls with AI-generated icebreakers
- **💾 Project Management** - Organize campaigns by client or vertical
- **📈 Strategy Wizard** - Step-by-step guided ICP creation
- **⚡ Real-time Updates** - Toast notifications and loading states

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **API Keys**:
  - [Google Gemini API Key](https://ai.google.dev/)
  - [Tavily API Key](https://tavily.com/) (for web crawling)

### Installation

```bash
# Clone the repository
git clone https://github.com/muzzyhaile/prospectfinder.git
cd prospectfinder

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your API keys

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_TAVILY_API_KEY=your_tavily_api_key_here
VITE_WEBHOOK_URL=https://your-webhook-url.com/leads
```

## 📁 Project Structure

```
Lead-scraper/
├── components/
│   ├── features/         # Feature-specific components
│   │   ├── projects/     # Project management views
│   │   ├── leads/        # Lead generation & management
│   │   └── icp/          # ICP builder & strategies
│   ├── layout/           # Layout components (Header, Sidebar, Footer)
│   ├── landing/          # Landing page sections
│   ├── modals/           # Reusable modals
│   └── shared/           # Shared UI components (Button, Input, Card, etc.)
├── config/               # Configuration files
│   └── env.ts           # Environment variable handling
├── constants/            # App constants (navigation, statuses, colors)
├── services/
│   ├── api/             # API client & error handling
│   ├── gemini/          # Gemini AI services (4 modules)
│   ├── tavily/          # Web crawling service
│   └── storage/         # localStorage abstraction
├── state/
│   ├── context/         # React Context providers (Auth, Project, Toast)
│   └── hooks/           # Custom hooks (useProjects, useLeads, etc.)
├── types/               # TypeScript type definitions
│   ├── domain/          # Domain models (Lead, Project, Strategy)
│   ├── api/             # API types
│   └── ui/              # UI component types
├── utils/               # Utility functions
│   ├── validation.ts    # Form validation
│   ├── format.ts        # Data formatting
│   ├── leads.ts         # Lead utilities
│   ├── errors.ts        # Error handling
│   └── export.ts        # CSV/JSON export
└── App.tsx              # Application root (120 lines)
```

## 🏗️ Architecture

### Modern React Architecture
- **Context + Hooks Pattern** - No prop drilling, clean state management
- **Feature-based Organization** - Components organized by domain
- **Service Layer** - Abstracted API calls with retry logic
- **Storage Layer** - Type-safe localStorage wrapper
- **Error Boundaries** - Graceful error handling

### Key Design Patterns
- **Custom Hooks** - Encapsulate business logic (`useProjects`, `useLeads`, `useStrategies`)
- **Barrel Exports** - Clean imports via index.ts files
- **Type Safety** - Full TypeScript coverage with strict mode
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Loading States** - Consistent async state handling

## 🎨 Tech Stack

- **Frontend Framework**: React 19.2 with TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI (@google/genai)
- **Web Crawling**: Tavily API
- **State Management**: React Context + Custom Hooks
- **Data Persistence**: localStorage with validation

## 📖 Usage

### 1. Create a Project
Navigate to the projects page and create a new project to organize your campaigns.

### 2. Define Your ICP
Use the Strategy Wizard to define your Ideal Customer Profile:
- Product/Service details
- Target audience
- Value proposition
- Target location

### 3. Generate Strategies
AI generates multiple targeting strategies with search queries and outreach angles.

### 4. Discover Leads
Use Google Maps integration to find businesses matching your criteria.

### 5. Enrich Leads
Automatically enrich leads with:
- Company summaries
- Services offered
- Recent news
- AI-generated icebreakers

### 6. Manage Pipeline
Track leads through your sales pipeline:
- New → Qualified → Meeting → Proposal → Won/Lost
- Add notes and comments
- Track deal values

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript Strict Mode** enabled
- **ESLint** configured for React best practices
- **Component Structure**: Consistent prop interfaces
- **Error Handling**: Typed error classes with retry logic

## 🔐 Security

- API keys stored in environment variables (never committed)
- Input validation on all forms
- XSS protection via React's built-in escaping
- localStorage data validation

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Gemini AI

# Prospect Finder - Repository Refactor Plan

## Executive Summary
This plan outlines a systematic refactoring of the Prospect Finder lead generation application to improve maintainability, scalability, and user experience. The app currently uses Gemini AI for lead discovery and enrichment, integrated with Google Maps grounding and Tavily web crawling.

## Goals
- Improve component organization and separation of concerns
- Extract reusable UI components and reduce duplication
- Centralize data fetching, caching, and error handling
- Improve type safety and maintainability
- Establish clear feature boundaries and ownership
- Add missing features (Footer, Features/Pricing pages)
- Secure API keys and sensitive data
- Prepare architecture for future scalability

---

## Current State Analysis

### Application Structure
**Root Files:**
- [App.tsx](App.tsx) (455 lines) - Main app shell with authentication, routing, project/lead state management
- [types.ts](types.ts) - All type definitions
- [constants.ts](constants.ts) - Single webhook URL constant
- [package.json](package.json) - Dependencies (React 19, Gemini AI SDK)
- [vite.config.ts](vite.config.ts) - Build configuration
- [tsconfig.json](tsconfig.json) - TypeScript configuration

**Components (19 files):**
- `LandingPage.tsx` - Landing page with broken Features/Pricing buttons, no footer
- `DashboardLayout.tsx` - Main dashboard wrapper with sidebar navigation
- `SearchFlow.tsx` - Lead generation wizard (category → refine → generate)
- `ICPBuilder.tsx` - ICP-driven strategy builder
- `StrategyWizard.tsx` - Multi-step ICP profile creator
- `ProjectCreate.tsx` - Project creation wizard
- `ProjectList.tsx` - List of user projects
- `CRMBoard.tsx` - Kanban-style pipeline view
- `DealModal.tsx` - Lead detail modal
- `LeadDetailModal.tsx` - Another lead detail viewer
- `LeadsTable.tsx` - Tabular lead display
- `LeadsMap.tsx` - Map visualization of leads
- `HistoryView.tsx` - Historical lead records
- `ProfileSettings.tsx` - User profile editor
- `CallMode.tsx` - Call/outreach interface
- `CategoryFinder.tsx` - Business category selector
- `StatusMessage.tsx` - Status message display component
- `icons.tsx` - Icon components

**Services (2 files):**
- `services/geminiService.ts` (344 lines) - All AI logic (category generation, ICP strategy, lead discovery, enrichment)
- `services/tavilyService.ts` - Website crawling via Tavily API

---

## Identified Issues & Anti-Patterns

### 🔴 Critical Issues

1. **API Keys Hardcoded in Client**
   - `process.env.API_KEY` exposed in client bundle ([geminiService.ts](services/geminiService.ts))
   - `TAVILY_API_KEY` hardcoded as string literal ([tavilyService.ts](services/tavilyService.ts))
   - **Security Risk**: Keys visible in browser, can be extracted and abused

2. **Broken UI Elements**
   - Features and Pricing buttons on [LandingPage.tsx](components/LandingPage.tsx#L22-L23) have no functionality
   - No footer on landing page
   - Poor UX - users expect these buttons to work

3. **No Error Boundaries**
   - Runtime errors crash entire application
   - No graceful degradation or error recovery

4. **No Data Persistence Strategy**
   - localStorage used directly in [App.tsx](App.tsx) without abstraction
   - No validation or migration strategy for stored data
   - Risk of data corruption or loss

### 🟡 Medium Priority Issues

5. **Monolithic Service File**
   - `geminiService.ts` (344 lines) handles 5 different domains:
     - Category generation
     - ICP strategy creation
     - Lead discovery (Google Maps)
     - Lead enrichment (Tavily + AI)
     - Legacy combined generation
   - Hard to test, maintain, or extend

6. **State Management Sprawl**
   - [App.tsx](App.tsx) manages 10+ pieces of state
   - Props drilled 3-4 levels deep
   - Duplicated loading/error patterns in multiple components
   - No single source of truth for project/lead data

7. **Component Responsibilities Unclear**
   - [SearchFlow.tsx](components/SearchFlow.tsx) handles UI, state, and business logic
   - [App.tsx](App.tsx) mixes authentication, routing, and data management
   - Hard to understand component boundaries

8. **Type Safety Gaps**
   - Optional chaining (`?.`) used extensively instead of proper null handling
   - Some `any` types likely present (needs audit)
   - No validation of AI responses before rendering

9. **Poor Constants Organization**
   - Only one constant file with single webhook URL
   - Magic strings throughout codebase (statuses, view names, etc.)
   - No centralized configuration

10. **Component Duplication**
    - Two lead detail modals: `LeadDetailModal.tsx` and `DealModal.tsx`
    - Similar loading/error UI patterns repeated
    - No shared button, input, or card components

### 🟢 Lower Priority Issues

11. **No Testing Infrastructure**
    - No unit tests, integration tests, or E2E tests
    - No test utilities or mocks

12. **Accessibility Gaps**
    - Missing ARIA labels on interactive elements
    - Keyboard navigation incomplete
    - No focus management in modals

13. **Performance Concerns**
    - No memoization of expensive renders
    - No lazy loading of routes or heavy components
    - All leads loaded at once (no pagination)

14. **Internationalization**
    - All text hardcoded in English
    - No i18n framework

---

## Proposed Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx           # Extracted from DashboardLayout
│   │   ├── Sidebar.tsx             # Extracted from DashboardLayout
│   │   ├── DashboardShell.tsx      # Simplified wrapper
│   │   ├── LandingHeader.tsx       # Landing page nav
│   │   ├── Footer.tsx              # NEW - Landing page footer
│   │   └── ErrorBoundary.tsx       # NEW - Error catching
│   │
│   ├── modals/
│   │   ├── LeadModal.tsx           # MERGED - Unified lead detail modal
│   │   └── ConfirmDialog.tsx       # NEW - Reusable confirmation
│   │
│   ├── shared/
│   │   ├── Button.tsx              # NEW - Standardized button
│   │   ├── Input.tsx               # NEW - Standardized input
│   │   ├── Card.tsx                # NEW - Card wrapper
│   │   ├── Badge.tsx               # NEW - Status badges
│   │   ├── EmptyState.tsx          # NEW - No data states
│   │   ├── LoadingSpinner.tsx      # NEW - Loading indicator
│   │   ├── Tabs.tsx                # NEW - Tab component
│   │   └── icons.tsx               # Keep existing
│   │
│   ├── views/
│   │   ├── landing/
│   │   │   ├── LandingView.tsx     # Renamed from LandingPage
│   │   │   ├── HeroSection.tsx     # Extracted hero
│   │   │   ├── FeaturesSection.tsx # NEW - Features page
│   │   │   ├── PricingSection.tsx  # NEW - Pricing page
│   │   │   └── CTASection.tsx      # Extracted CTA
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectListView.tsx # Renamed from ProjectList
│   │   │   └── ProjectCreateView.tsx # Renamed from ProjectCreate
│   │   │
│   │   ├── leads/
│   │   │   ├── SearchFlowView.tsx  # Renamed from SearchFlow
│   │   │   ├── LeadsTableView.tsx  # Renamed from LeadsTable
│   │   │   ├── LeadsMapView.tsx    # Renamed from LeadsMap
│   │   │   ├── HistoryView.tsx     # Keep existing
│   │   │   └── CallModeView.tsx    # Renamed from CallMode
│   │   │
│   │   ├── icp/
│   │   │   ├── ICPBuilderView.tsx  # Renamed from ICPBuilder
│   │   │   └── StrategyWizardView.tsx # Renamed from StrategyWizard
│   │   │
│   │   ├── pipeline/
│   │   │   └── CRMBoardView.tsx    # Renamed from CRMBoard
│   │   │
│   │   └── settings/
│   │       └── ProfileView.tsx     # Renamed from ProfileSettings
│   │
│   └── features/
│       ├── category-finder/
│       │   └── CategoryFinder.tsx  # Feature-specific component
│       │
│       ├── lead-generation/
│       │   └── LeadForm.tsx        # Feature-specific component
│       │
│       └── status/
│           └── StatusMessage.tsx   # Feature-specific component
│
├── services/
│   ├── api/
│   │   ├── client.ts               # NEW - Base AI client setup
│   │   ├── errorHandler.ts         # NEW - Error handling
│   │   └── retry.ts                # NEW - Retry logic
│   │
│   ├── gemini/
│   │   ├── categories.ts           # Category generation
│   │   ├── icpStrategy.ts          # ICP strategy generation
│   │   ├── leadDiscovery.ts        # Google Maps lead finding
│   │   ├── leadEnrichment.ts       # Website crawl + enrichment
│   │   └── index.ts                # Barrel export
│   │
│   ├── tavily/
│   │   ├── crawler.ts              # Renamed from tavilyService
│   │   └── index.ts                # Barrel export
│   │
│   └── storage/
│       ├── localStorage.ts         # NEW - Storage abstraction
│       ├── projectStorage.ts       # NEW - Project CRUD
│       ├── leadStorage.ts          # NEW - Lead CRUD
│       └── strategyStorage.ts      # NEW - Strategy CRUD
│
├── state/
│   ├── hooks/
│   │   ├── useAuth.ts              # NEW - Authentication state
│   │   ├── useProjects.ts          # NEW - Project management
│   │   ├── useLeads.ts             # NEW - Lead management
│   │   ├── useStrategies.ts        # NEW - Strategy management
│   │   ├── useLeadGeneration.ts    # NEW - Lead generation flow
│   │   ├── useICPBuilder.ts        # NEW - ICP building flow
│   │   └── usePersistedState.ts    # NEW - LocalStorage sync
│   │
│   ├── context/
│   │   ├── AuthContext.tsx         # NEW - Auth provider
│   │   ├── ProjectContext.tsx      # NEW - Active project provider
│   │   └── ToastContext.tsx        # NEW - Toast notifications
│   │
│   └── stores/
│       ├── appStore.ts             # NEW - Global app state (if using Zustand/similar)
│       └── cacheStore.ts           # NEW - Request caching
│
├── types/
│   ├── domain/
│   │   ├── lead.ts                 # Lead-related types
│   │   ├── project.ts              # Project-related types
│   │   ├── strategy.ts             # Strategy-related types
│   │   ├── user.ts                 # User-related types
│   │   └── index.ts                # Barrel export
│   │
│   ├── api/
│   │   ├── gemini.ts               # Gemini API types
│   │   ├── tavily.ts               # Tavily API types
│   │   └── index.ts                # Barrel export
│   │
│   └── ui/
│       ├── components.ts           # Component prop types
│       ├── events.ts               # Event handler types
│       └── index.ts                # Barrel export
│
├── constants/
│   ├── navigation.ts               # View/route names
│   ├── statuses.ts                 # Lead statuses, stages
│   ├── api.ts                      # API endpoints, keys config
│   ├── ui.ts                       # UI constants (colors, sizes)
│   └── index.ts                    # Barrel export
│
├── utils/
│   ├── validation.ts               # Input validation
│   ├── format.ts                   # Text/date formatting
│   ├── leads.ts                    # Lead-specific utilities
│   ├── errors.ts                   # Error handling utilities
│   └── index.ts                    # Barrel export
│
├── config/
│   ├── env.ts                      # NEW - Environment variable handling
│   └── features.ts                 # NEW - Feature flags
│
├── App.tsx                         # Simplified to <100 lines
├── index.tsx                       # Entry point
└── README.md                       # Updated documentation
```

---

## Detailed Refactor Plan

### Phase 1: Foundation & Setup (High Priority)
**Goal**: Create structure, extract constants, improve security

#### 1.1 Create Directory Structure
- [ ] Create all folders in proposed architecture
- [ ] Add `index.ts` barrel exports for clean imports

#### 1.2 Security: Move API Keys
- [ ] Create `config/env.ts` with environment variable validation
- [ ] Remove hardcoded `TAVILY_API_KEY` from `tavilyService.ts`
- [ ] Add `.env.local.example` template file
- [ ] Update documentation on API key setup
- [ ] **Critical**: Ensure keys not committed to git

#### 1.3 Extract Constants
- [ ] Create `constants/navigation.ts` with all view names, routes
- [ ] Create `constants/statuses.ts` with lead stages, statuses
- [ ] Create `constants/api.ts` with webhook URL, endpoints
- [ ] Create `constants/ui.ts` with colors, breakpoints, sizes
- [ ] Replace magic strings throughout codebase

#### 1.4 Split `types.ts`
- [ ] Move lead types to `types/domain/lead.ts`
- [ ] Move project types to `types/domain/project.ts`
- [ ] Move strategy types to `types/domain/strategy.ts`
- [ ] Move user types to `types/domain/user.ts`
- [ ] Create API types in `types/api/`
- [ ] Keep backward-compatible re-exports in root `types.ts`

#### 1.5 Create Utility Functions
- [ ] Create `utils/validation.ts` with input validators
- [ ] Create `utils/format.ts` with date/text formatters
- [ ] Create `utils/leads.ts` with lead-specific helpers
- [ ] Create `utils/errors.ts` with error utilities

---

### Phase 2: Service Layer Refactor
**Goal**: Break down monolithic services, add error handling

#### 2.1 API Client Infrastructure
- [ ] Create `services/api/client.ts` with Gemini AI initialization
- [ ] Create `services/api/errorHandler.ts` with typed errors
- [ ] Create `services/api/retry.ts` with retry logic
- [ ] Add request timeout handling

#### 2.2 Split `geminiService.ts` by Domain
- [ ] Extract to `services/gemini/categories.ts` - category generation
- [ ] Extract to `services/gemini/icpStrategy.ts` - ICP strategy creation
- [ ] Extract to `services/gemini/leadDiscovery.ts` - Google Maps lead discovery
- [ ] Extract to `services/gemini/leadEnrichment.ts` - Enrichment logic
- [ ] Create `services/gemini/index.ts` barrel export
- [ ] Delete old `geminiService.ts` after migration

#### 2.3 Refactor Tavily Service
- [ ] Rename `tavilyService.ts` → `services/tavily/crawler.ts`
- [ ] Remove hardcoded API key, use `config/env.ts`
- [ ] Add error handling and retry logic
- [ ] Create `services/tavily/index.ts` barrel export

#### 2.4 Storage Abstraction Layer
- [ ] Create `services/storage/localStorage.ts` wrapper with validation
- [ ] Create `services/storage/projectStorage.ts` for project CRUD
- [ ] Create `services/storage/leadStorage.ts` for lead CRUD
- [ ] Create `services/storage/strategyStorage.ts` for strategy CRUD
- [ ] Add data migration utilities for version changes

---

### Phase 3: State Management Layer
**Goal**: Centralize state logic, reduce prop drilling

#### 3.1 Context Providers
- [ ] Create `state/context/AuthContext.tsx` for user authentication
- [ ] Create `state/context/ProjectContext.tsx` for active project
- [ ] Create `state/context/ToastContext.tsx` for notifications

#### 3.2 Custom Hooks for Data Management
- [ ] Create `state/hooks/useAuth.ts` - login, logout, user state
- [ ] Create `state/hooks/useProjects.ts` - project CRUD with persistence
- [ ] Create `state/hooks/useLeads.ts` - lead CRUD with persistence
- [ ] Create `state/hooks/useStrategies.ts` - strategy CRUD with persistence
- [ ] Create `state/hooks/useLeadGeneration.ts` - lead generation workflow
- [ ] Create `state/hooks/useICPBuilder.ts` - ICP building workflow
- [ ] Create `state/hooks/usePersistedState.ts` - localStorage sync utility

#### 3.3 Loading & Error Patterns
- [ ] Standardize loading states in hooks
- [ ] Standardize error handling in hooks
- [ ] Create consistent return types (data, loading, error, refetch)

---

### Phase 4: UI Components & Design System
**Goal**: Extract reusable components, reduce duplication

#### 4.1 Shared UI Components
- [ ] Create `components/shared/Button.tsx` with variants
- [ ] Create `components/shared/Input.tsx` for forms
- [ ] Create `components/shared/Card.tsx` wrapper
- [ ] Create `components/shared/Badge.tsx` for status indicators
- [ ] Create `components/shared/EmptyState.tsx` for no data
- [ ] Create `components/shared/LoadingSpinner.tsx`
- [ ] Create `components/shared/Tabs.tsx` for tabbed interfaces

#### 4.2 Layout Components
- [ ] Extract `components/layout/AppHeader.tsx` from DashboardLayout
- [ ] Extract `components/layout/Sidebar.tsx` from DashboardLayout
- [ ] Create `components/layout/DashboardShell.tsx` simplified wrapper
- [ ] Create `components/layout/LandingHeader.tsx` for landing page
- [ ] Create `components/layout/Footer.tsx` for landing page
- [ ] Create `components/layout/ErrorBoundary.tsx`

#### 4.3 Modal Components
- [ ] Merge `LeadDetailModal.tsx` + `DealModal.tsx` → `modals/LeadModal.tsx`
- [ ] Create `components/modals/ConfirmDialog.tsx` reusable confirm

---

### Phase 5: View Components Refactor
**Goal**: Simplify views, use hooks and shared components

#### 5.1 Landing Page Views
- [ ] Rename `LandingPage.tsx` → `views/landing/LandingView.tsx`
- [ ] Extract `views/landing/HeroSection.tsx`
- [ ] Create `views/landing/FeaturesSection.tsx` (NEW - fix broken button)
- [ ] Create `views/landing/PricingSection.tsx` (NEW - fix broken button)
- [ ] Extract `views/landing/CTASection.tsx`
- [ ] Add Footer to landing layout

#### 5.2 Project Views
- [ ] Rename `ProjectList.tsx` → `views/projects/ProjectListView.tsx`
- [ ] Rename `ProjectCreate.tsx` → `views/projects/ProjectCreateView.tsx`
- [ ] Refactor to use `useProjects` hook
- [ ] Use shared UI components

#### 5.3 Lead Views
- [ ] Rename `SearchFlow.tsx` → `views/leads/SearchFlowView.tsx`
- [ ] Rename `LeadsTable.tsx` → `views/leads/LeadsTableView.tsx`
- [ ] Rename `LeadsMap.tsx` → `views/leads/LeadsMapView.tsx`
- [ ] Rename `CallMode.tsx` → `views/leads/CallModeView.tsx`
- [ ] Keep `HistoryView.tsx` in `views/leads/`
- [ ] Refactor to use `useLeads` and `useLeadGeneration` hooks

#### 5.4 ICP Views
- [ ] Rename `ICPBuilder.tsx` → `views/icp/ICPBuilderView.tsx`
- [ ] Rename `StrategyWizard.tsx` → `views/icp/StrategyWizardView.tsx`
- [ ] Refactor to use `useICPBuilder` and `useStrategies` hooks

#### 5.5 Pipeline & Settings Views
- [ ] Rename `CRMBoard.tsx` → `views/pipeline/CRMBoardView.tsx`
- [ ] Rename `ProfileSettings.tsx` → `views/settings/ProfileView.tsx`
- [ ] Refactor to use appropriate hooks

#### 5.6 Feature-Specific Components
- [ ] Move `CategoryFinder.tsx` → `features/category-finder/`
- [ ] Move `LeadForm.tsx` → `features/lead-generation/`
- [ ] Move `StatusMessage.tsx` → `features/status/`

---

### Phase 6: App Shell Simplification
**Goal**: Make `App.tsx` a thin orchestrator

#### 6.1 Simplify App.tsx
- [ ] Remove direct state management, use context providers
- [ ] Remove localStorage logic, use custom hooks
- [ ] Simplify routing logic
- [ ] Target < 100 lines
- [ ] Move demo data to `services/storage/seedData.ts`

#### 6.2 Add Error Boundary
- [ ] Wrap app in `ErrorBoundary` component
- [ ] Implement graceful error UI with retry

#### 6.3 Add Context Providers
- [ ] Wrap with `AuthContext.Provider`
- [ ] Wrap with `ProjectContext.Provider`
- [ ] Wrap with `ToastContext.Provider`

---

### Phase 7: Security & Quality Assurance
**Goal**: Ensure production-readiness and security

#### 7.1 Security Audit
- [ ] Verify no API keys in client bundle
- [ ] Add input sanitization to all forms
- [ ] Validate AI responses before rendering
- [ ] Review localStorage for sensitive data exposure
- [ ] Remove sensitive data from console logs (production)
- [ ] Ensure proper CORS configuration for webhook

#### 7.2 Validation Layer
- [ ] Add form validation to all input fields
- [ ] Validate email formats, URLs
- [ ] Add rate limiting awareness (API quotas)
- [ ] Validate localStorage data on load (handle corruption)

#### 7.3 Error Handling Improvements
- [ ] User-friendly error messages (no stack traces)
- [ ] Implement retry UI for failed operations
- [ ] Add fallback states for missing data
- [ ] Log errors to console in dev, suppress in production

#### 7.4 Performance Optimization
- [ ] Add memoization to expensive renders
- [ ] Implement pagination for lead lists
- [ ] Lazy load heavy components (maps, charts)
- [ ] Optimize bundle size

---

### Phase 8: Testing & Documentation
**Goal**: Verify functionality and document architecture

#### 8.1 Manual Testing
- [ ] Test landing page (Features/Pricing navigation, Footer)
- [ ] Test authentication flow
- [ ] Test project creation and deletion
- [ ] Test ICP strategy wizard
- [ ] Test lead generation (discovery + enrichment)
- [ ] Test CRM pipeline (drag-drop, status changes)
- [ ] Test persistence (browser refresh)
- [ ] Test error states (invalid inputs, API failures)

#### 8.2 TypeScript Quality
- [ ] Enable strict mode in `tsconfig.json`
- [ ] Fix all type errors
- [ ] Remove all `any` types
- [ ] Add proper null checks

#### 8.3 Dependency Management
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update outdated packages
- [ ] Document all external dependencies

#### 8.4 Documentation
- [ ] Update `README.md` with new architecture
- [ ] Add JSDoc comments to key functions
- [ ] Create `ARCHITECTURE.md` document
- [ ] Document API key setup process
- [ ] Add CONTRIBUTING.md guidelines

---

## Acceptance Criteria

### ✅ Structure
- [ ] All files follow new directory structure
- [ ] No orphaned files
- [ ] Clear barrel exports for public APIs
- [ ] Consistent naming conventions

### ✅ App Shell
- [ ] `App.tsx` < 100 lines
- [ ] No business logic in `App.tsx`
- [ ] Uses context providers for global state
- [ ] Error boundary wraps entire app

### ✅ Components
- [ ] View components use semantic names (not prefixes)
- [ ] Shared UI components reused across views
- [ ] No duplicated loading/error state management
- [ ] Single responsibility principle applied

### ✅ Services
- [ ] Service files < 250 lines each
- [ ] Domain-specific service modules
- [ ] Consistent error handling
- [ ] No direct API calls from components

### ✅ State Management
- [ ] Custom hooks encapsulate data fetching
- [ ] Standardized loading/error/success patterns
- [ ] Persistence layer working (survives refresh)
- [ ] No prop drilling beyond 2 levels

### ✅ Types
- [ ] Types organized by domain
- [ ] No duplicated type definitions
- [ ] Strict TypeScript with no `any`
- [ ] Proper null/undefined handling

### ✅ Security
- [ ] No API keys in client bundle
- [ ] Input validation on all forms
- [ ] AI responses validated before rendering
- [ ] No sensitive data in logs (production)

### ✅ User Experience
- [ ] Features and Pricing buttons work
- [ ] Footer present on landing page
- [ ] Error messages user-friendly
- [ ] Loading states clear
- [ ] No broken functionality

### ✅ Testing
- [ ] All critical user flows verified
- [ ] No console errors in dev mode
- [ ] No TypeScript errors
- [ ] App stable with no crashes

---

## Software Engineering Principles

### SOLID Principles
- ✅ **Single Responsibility**: Each component/service/hook has one clear purpose
- ✅ **Open/Closed**: Extend behavior via composition (shared components, hooks)
- ✅ **Liskov Substitution**: Shared components interchangeable
- ✅ **Interface Segregation**: Small, focused prop types
- ✅ **Dependency Inversion**: Depend on abstractions (hooks, context) not concrete services

### Additional Principles
- ✅ **DRY**: Extract shared logic into reusable modules
- ✅ **KISS**: Component APIs minimal and predictable
- ✅ **YAGNI**: No speculative abstractions without current use
- ✅ **Separation of Concerns**: UI, state, services, types in distinct layers
- ✅ **Law of Demeter**: Components interact with direct dependencies only
- ✅ **Composition over Inheritance**: Use React composition patterns
- ✅ **Consistency**: Unified naming, file placement, error handling

### Code Quality
- ✅ **Explicit over Implicit**: Clear function names, typed returns
- ✅ **Fail Fast**: Validate inputs early, throw descriptive errors
- ✅ **Pure Functions**: Utilities have no side effects
- ✅ **Immutability**: Immutable state updates (React best practice)
- ✅ **Declarative**: Declarative JSX over imperative DOM manipulation

---

## Security Considerations (OWASP Frontend)

### 🔒 Critical Security Items

#### API Key Exposure
- ⚠️ **Current**: `process.env.API_KEY` accessible in client, `TAVILY_API_KEY` hardcoded
- ✅ **Fix**: Move to server-side proxy or secure configuration service
- Never commit keys to version control
- Add `.env.local` to `.gitignore`

#### Input Validation & Output Encoding
- Validate all user inputs (names, emails, URLs)
- Sanitize before passing to AI services
- Validate AI responses before rendering
- Avoid `dangerouslySetInnerHTML` (currently not used ✅)

#### Sensitive Data Exposure
- Avoid logging leads, PII in console (production)
- Review localStorage for sensitive data
- Clear localStorage on logout if auth added
- Redact sensitive fields in error messages

#### Cross-Site Scripting (XSS)
- React JSX auto-escapes by default ✅
- Validate AI-generated content before display
- Never use `eval()` or `Function()` with user input

#### Security Misconfiguration
- Strip dev-only code in production builds
- Set Content Security Policy (CSP) headers
- Configure proper CORS on backend
- Disable source maps in production

#### Dependency Vulnerabilities
- Run `npm audit` regularly
- Keep `@google/genai`, `react` updated
- Use Dependabot or Snyk for monitoring

#### Error Handling
- Never expose stack traces to users
- Provide user-friendly error messages
- Log detailed errors server-side only

#### Supply Chain Security
- Pin dependency versions in `package.json`
- Review new dependencies before adding
- Use `package-lock.json`

### 🔍 Security Action Items
1. **Phase 1**: Move API keys out of client bundle
2. **Phase 7**: Add input validation layer
3. **Phase 7**: Review localStorage for sensitive data
4. **Phase 8**: Run `npm audit` and fix vulnerabilities
5. **Production**: Setup CSP headers and secure build

---

## Implementation Strategy

### Migration Approach
- **Incremental, not big-bang**: Complete one phase before next
- **Keep main working**: Use feature branches for large changes
- **Update imports immediately**: Fix all imports after moving files
- **Test after each phase**: Don't accumulate untested changes

### Priority Order
1. **Phase 1 (Foundation)** - Structure + security fixes
2. **Phase 2 (Services)** - Biggest pain point
3. **Phase 3 (State)** - Enables cleaner components
4. **Phase 4 (UI Components)** - Foundation for views
5. **Phase 5 (Views)** - Now easy with hooks + components ready
6. **Phase 6 (App Shell)** - Simplification
7. **Phase 7 (Security)** - Critical for production
8. **Phase 8 (Testing)** - Final verification

### Quick Wins (Can do first)
- Fix Features/Pricing buttons + add Footer (1-2 hours)
- Extract API keys to env config (30 min)
- Create shared Button/Card components (1 hour)
- Add ErrorBoundary (30 min)

### Breaking Changes to Expect
- Import paths will change (update all)
- Component names will change (update routes)
- Service function signatures may change (update callers)
- Type locations will change (update imports)

### Rollback Plan
- Keep old files until new ones verified
- Tag commits at each phase completion
- Document manual migration steps

---

## TODO Checklist

### Phase 1: Foundation ⚙️
- [ ] Create all directories in proposed structure
- [ ] Create `config/env.ts` with API key handling
- [ ] Remove hardcoded `TAVILY_API_KEY`
- [ ] Add `.env.local.example` file
- [ ] Create `constants/navigation.ts`
- [ ] Create `constants/statuses.ts`
- [ ] Create `constants/api.ts`
- [ ] Create `constants/ui.ts`
- [ ] Split `types.ts` into domain files
- [ ] Create `utils/validation.ts`
- [ ] Create `utils/format.ts`
- [ ] Create `utils/leads.ts`
- [ ] Create `utils/errors.ts`

### Phase 2: Service Layer 🔧
- [ ] Create `services/api/client.ts`
- [ ] Create `services/api/errorHandler.ts`
- [ ] Create `services/api/retry.ts`
- [ ] Extract to `services/gemini/categories.ts`
- [ ] Extract to `services/gemini/icpStrategy.ts`
- [ ] Extract to `services/gemini/leadDiscovery.ts`
- [ ] Extract to `services/gemini/leadEnrichment.ts`
- [ ] Create barrel exports for services
- [ ] Refactor `tavilyService.ts` → `services/tavily/crawler.ts`
- [ ] Create `services/storage/localStorage.ts`
- [ ] Create `services/storage/projectStorage.ts`
- [ ] Create `services/storage/leadStorage.ts`
- [ ] Create `services/storage/strategyStorage.ts`

### Phase 3: State Layer 📊
- [ ] Create `state/context/AuthContext.tsx`
- [ ] Create `state/context/ProjectContext.tsx`
- [ ] Create `state/context/ToastContext.tsx`
- [ ] Create `state/hooks/useAuth.ts`
- [ ] Create `state/hooks/useProjects.ts`
- [ ] Create `state/hooks/useLeads.ts`
- [ ] Create `state/hooks/useStrategies.ts`
- [ ] Create `state/hooks/useLeadGeneration.ts`
- [ ] Create `state/hooks/useICPBuilder.ts`
- [ ] Create `state/hooks/usePersistedState.ts`

### Phase 4: UI Components 🎨
- [ ] Create `components/shared/Button.tsx`
- [ ] Create `components/shared/Input.tsx`
- [ ] Create `components/shared/Card.tsx`
- [ ] Create `components/shared/Badge.tsx`
- [ ] Create `components/shared/EmptyState.tsx`
- [ ] Create `components/shared/LoadingSpinner.tsx`
- [ ] Create `components/shared/Tabs.tsx`
- [ ] Create `components/layout/AppHeader.tsx`
- [ ] Create `components/layout/Sidebar.tsx`
- [ ] Create `components/layout/DashboardShell.tsx`
- [ ] Create `components/layout/LandingHeader.tsx`
- [ ] Create `components/layout/Footer.tsx`
- [ ] Create `components/layout/ErrorBoundary.tsx`
- [ ] Merge modals → `components/modals/LeadModal.tsx`
- [ ] Create `components/modals/ConfirmDialog.tsx`

### Phase 5: Views 🖼️
- [ ] Refactor `LandingPage.tsx` → `views/landing/LandingView.tsx`
- [ ] Extract `views/landing/HeroSection.tsx`
- [ ] Create `views/landing/FeaturesSection.tsx` (NEW)
- [ ] Create `views/landing/PricingSection.tsx` (NEW)
- [ ] Extract `views/landing/CTASection.tsx`
- [ ] Refactor project views to `views/projects/`
- [ ] Refactor lead views to `views/leads/`
- [ ] Refactor ICP views to `views/icp/`
- [ ] Refactor pipeline view to `views/pipeline/`
- [ ] Refactor settings view to `views/settings/`
- [ ] Move feature-specific components to `features/`

### Phase 6: App Shell 🏗️
- [ ] Remove state management from `App.tsx`
- [ ] Add context providers to `App.tsx`
- [ ] Wrap app with `ErrorBoundary`
- [ ] Simplify routing logic
- [ ] Target < 100 lines in `App.tsx`
- [ ] Move demo data to `services/storage/seedData.ts`

### Phase 7: Security 🔒
- [ ] Verify no API keys in bundle
- [ ] Add form input validation
- [ ] Validate AI responses before render
- [ ] Review localStorage security
- [ ] Remove sensitive logs in production
- [ ] Add retry UI for failures
- [ ] User-friendly error messages

### Phase 8: Testing ✅
- [ ] Test landing page (Features, Pricing, Footer)
- [ ] Test authentication flow
- [ ] Test project CRUD
- [ ] Test ICP strategy wizard
- [ ] Test lead generation flow
- [ ] Test CRM pipeline
- [ ] Test persistence after refresh
- [ ] Enable TypeScript strict mode
- [ ] Fix all type errors
- [ ] Run `npm audit` and fix issues
- [ ] Update README.md
- [ ] Create ARCHITECTURE.md
- [ ] Add JSDoc comments

---

## Future Enhancements (Post-Refactor)

### Features
- Multi-user support with real authentication
- Team collaboration (share projects)
- Export leads to CSV/Excel
- Email campaign integration
- Calendar/reminder system for follow-ups
- Template library for icebreakers
- A/B testing for outreach messages
- Analytics dashboard (conversion rates, etc.)

### Technical
- Unit tests (Jest/Vitest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)
- CI/CD pipeline
- Docker containerization
- Backend API (replace client-side AI calls)
- Database persistence (replace localStorage)
- Real-time collaboration (WebSockets)

### UX/UI
- Dark mode
- Mobile responsive improvements
- Keyboard shortcuts
- Undo/redo functionality
- Drag-and-drop file uploads
- Bulk operations (select multiple leads)
- Advanced filtering and search

---

## References
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tavily API Documentation](https://tavily.com/docs)

---

**Document Version**: 1.0  
**Last Updated**: January 18, 2026  
**Status**: 📋 Planning Phase  
**Estimated Effort**: 40-60 hours for complete refactor

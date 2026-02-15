# React + Vite

A feature-rich Todo application built with React 19, TanStack Query, React Router, Tailwind CSS v4, and Shadcn UI. This project demonstrates modern frontend engineering practices including API integration, authentication, CRUD operations, pagination, filtering, and responsive design.

## Live Demo
[stackblitz.com/edit/todo-app-project]

## Features

### Core Features (Required)
- ✅ **Todo List with Pagination** - 10 items per page with URL-synced pagination
- ✅ **Todo Details** - Nested route to view individual task details
- ✅ **Search & Filtering** - Server-side search and filtering by status, priority
- ✅ **Error Handling** - Error Boundary component and custom 404 page
- ✅ **Responsive Design** - Mobile-first, fully responsive UI
- ✅ **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

### Bonus Features Implemented
- ✅ **Complete CRUD Operations**
  - Create tasks with modal form
  - Read tasks with detail view
  - Update tasks with edit dialog
  - Delete tasks with confirmation dialog
- ✅ **Authentication & User Management**
  - User registration with validation
  - User login with JWT tokens
  - Protected routes for authenticated users
  - User profile page
  - Automatic token refresh
  - Persistent login state

- ✅ **Advanced Filtering**
  - Filter by status (TODO, IN_PROGRESS, DONE, CANCELLED)
  - Filter by priority (LOW, MEDIUM, HIGH)
  - Search by task name
  - Sort by date (ASC/DESC)
  - URL params persist filters

- ✅ **Real-time Updates**
  - Optimistic UI updates
  - Automatic cache invalidation
## Technology Stack

### Core
- **React 19** - Latest version with hooks and Suspense
- **React Router v7** - Nested routing and protected routes
- **TanStack Query v5** - Server state management, caching, mutations
- **Axios** - HTTP client with interceptors for auth

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn UI** - Accessible component library
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - Schema validation (via API)
## Project Structure

```
src/
├── api/               # API client and TanStack Query hooks
│   └── todos.js       # Todo-related queries and mutations
├── components/        # Reusable UI components
│   ├── ui/            # Shadcn UI components
│   ├── CreateTaskDialog.jsx
│   ├── DeleteTaskDialog.jsx
│   ├── EditTaskDialog.jsx
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   └── ProtectedRoute.jsx
├── contexts/          # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── layouts/           # Layout components
│   └── RootLayout.jsx # Main layout with navigation
├── lib/               # Utilities and configuration
│   └── api.js         # Axios instance with interceptors
├── pages/             # Route pages
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ProfilePage.jsx
│   ├── TodoListPage.jsx
│   ├── TodoDetailPage.jsx
│   ├── NotFoundPage.jsx
│   └── TestErrorPage.jsx
├── App.jsx            # Main app with routes
├── main.jsx           # Entry point with providers
└── index.css          # Tailwind imports
```

## API Integration

Base URL: `https://api.oluwasetemi.dev`

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile

### Todo Endpoints
- `GET /tasks` - List todos (with pagination, filters)
- `GET /tasks/{id}` - Get single todo
- `POST /tasks` - Create new todo
- `PATCH /tasks/{id}` - Update todo
- `DELETE /tasks/{id}` - Delete todo

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd taskmaster-pro
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication Flow

1. **Registration** (`/register`)
   - User provides name, email, password
   - API returns accessToken and refreshToken
   - Tokens stored in localStorage
   - User redirected to dashboard

2. **Login** (`/login`)
   - User provides email and password
   - API returns tokens
   - User state updated via AuthContext
   - Redirect to dashboard
   3. **Protected Routes**
   - Routes wrapped in `<ProtectedRoute>` component
   - Checks authentication state
   - Redirects to login if not authenticated

4. **Token Management**
   - Access token attached to all requests via interceptor
   - Automatic token refresh on 401 responses
   - Logout clears tokens and redirects

## Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Clean login form with validation*

### Todo Dashboard
![Todo Dashboard](screenshots/dashboard.png)
*Main todo list with filters and pagination*

### Task Details
![Task Details](screenshots/details.png)
*Detailed view with all task information*

### Edit Task
![Edit Task](screenshots/edit.png)
*Edit modal with priority and status selection*

### User Profile
![User Profile](screenshots/profile.png)
*User profile with account information*

## Key Implementation Details

### Authentication Context
```javascript
// AuthContext provides global auth state
const { user, login, register, logout, isAuthenticated } = useAuth();
```

### Protected Routes
```javascript
<Route path="/" element={
  <ProtectedRoute>
    <RootLayout />
  </ProtectedRoute>
}>
  {/* Protected routes here */}
</Route>
```

### API Integration with TanStack Query
```javascript
// Automatic caching and background updates
const { data, isLoading } = useTodos({ page, status, priority });

// Optimistic updates with mutations
const mutation = useUpdateTodo({
  onSuccess: () => {
    queryClient.invalidateQueries(['todos']);
  }
});
```

### Filter State in URL
```javascript
// Filters persist in URL for shareability
const [searchParams, setSearchParams] = useSearchParams();
const status = searchParams.get('status') || '';
```

## Known Issues & Future Improvements

### Current Issues
- Need to implement proper error boundaries for auth failures

### Planned Improvements
- [ ] Add unit tests with React Testing Library
- [ ] Add E2E tests with Playwright
- [ ] Implement dark mode
- [ ] Add task categories/tags management
- [ ] Add file attachments to tasks


## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or as a template.

## Acknowledgments

- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [API.OLUWASETEMI.DEV](https://api.oluwasetemi.dev)
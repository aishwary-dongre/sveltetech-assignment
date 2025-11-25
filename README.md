# SvelteTech Frontend Dashboard

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

An Admin dashboard I built using React and TypeScript. It's got user authentication, a complete user management system, and a dark mode that actually looks good.

## What's Inside

**Authentication**
- Login system with encrypted sessions (using AES-256)
- Sessions expire after 24 hours
- Routes are protected, so you can't access pages without logging in
- Demo account: admin@example.com / admin123

**User Management**
- View, edit, search users
- Filter by city or company
- Shows 5 users per page
- Got the data from JSONPlaceholder API

**Dashboard**
- Stats cards showing user count, sessions, revenue, server load
- A simple bar chart for weekly traffic
- Recent activity list
- Some quick action buttons

**Settings Page**
- Toggle dark mode (it saves your preference)
- Manage notification settings (email, push, SMS)
- Change language and timezone
- Everything auto-saves to localStorage

**UI Stuff**
- Works on mobile, tablet, and desktop
- Toast notifications pop up when you do something
- Loading spinners where needed
- Smooth transitions between pages

## Setup Instructions

### Prerequisites

Make sure you have these installed:
- Node.js (version 18 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sveltetech-frontend-dashboard.git
cd sveltetech-frontend-dashboard
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- React Router for navigation
- Tailwind CSS for styling
- TypeScript
- Zustand for state management
- Crypto-JS for encryption
- Vite as the build tool

### Step 3: Environment Setup (Optional)

Create a `.env` file in the root directory if you want to customize:

```env
VITE_SECRET_KEY=your-custom-encryption-key
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 5: Login

Use these credentials:
- Email: `admin@example.com`
- Password: `admin123`

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Design Decisions

### Why React + TypeScript?

I went with React because it's got a huge ecosystem and TypeScript adds type safety which catches bugs early. The combination makes the code more maintainable.

### State Management Strategy

I used a hybrid approach:
- **Zustand** for global app state (notifications, loading states, errors) - it's lightweight and doesn't require much boilerplate
- **React Context** for auth and theme - these don't change often, so Context works fine
- **Local state** for UI stuff like modals and form inputs

### Authentication Approach

Instead of using plain localStorage, I encrypted the session data with AES-256. It's not perfect security, but it's better than storing tokens in plain text. Sessions expire after 24 hours to limit exposure.

### API Layer

I built a custom API utility with retry logic. If a network request fails, it automatically retries up to 3 times with increasing delays (1s, 2s, 3s). This makes the app more resilient to flaky connections.

### Styling Choice

Tailwind CSS was the obvious choice here - it's fast to work with and keeps the bundle size small. I added dark mode support using Tailwind's `dark:` variants. The theme preference persists in localStorage.

### Component Architecture

I organized components by feature rather than type:
- Layout components (Sidebar, Header) in their own folder
- Reusable components (Toast, Modal) at the root
- Page components separate from business logic

Each component does one thing well. The EditUserModal handles user editing, Toast shows notifications, etc.

### Data Fetching

I created custom hooks like `useUsers` and `useSettings` to keep data fetching logic separate from UI components. This makes testing easier and the code more reusable.

### Form Handling

All forms use controlled components. The EditUserModal validates inputs before submission and shows error messages inline. I avoided using heavy form libraries to keep things simple.

### Performance Considerations

- Used `useMemo` for expensive filtering operations
- Pagination limits rendered items to 5 per page
- Toast notifications auto-dismiss after 5 seconds to prevent clutter
- Dark mode applies instantly without page refresh

### File Structure

I kept the structure flat and simple:
```
src/
├── components/    # UI components
├── pages/         # Route pages
├── hooks/         # Custom hooks
├── contexts/      # React contexts
├── store/         # Zustand store
├── utils/         # Helpers
└── types/         # TypeScript types
```

Everything is organized by function, not by file type. This makes it easier to find related code.

### Error Handling

I added three levels of error handling:
1. Try-catch blocks in API calls
2. Error boundaries for component crashes
3. Toast notifications to inform users

Network errors show retry options. Form errors display inline. System errors log to console.

### TypeScript Usage

I defined types for everything - API responses, component props, state shapes. This caught a lot of bugs during development and makes refactoring safer.

## Built With

- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management
- Vite as build tool
- Crypto-JS for encryption

## Project Structure

```
src/
├── components/       # Reusable UI pieces
│   ├── layout/      # Sidebar, Header, DashboardLayout
│   ├── EditUserModal.tsx
│   ├── Toast.tsx
│   └── NotificationManager.tsx
├── pages/           # Main pages
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   └── Settings.tsx
├── hooks/           # Custom React hooks
│   ├── useUsers.ts
│   └── useSettings.ts
├── store/           # Zustand store
│   └── appStore.ts
├── contexts/        # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── utils/           # Helper functions
│   ├── api.ts
│   └── encryption.ts
└── types/           # TypeScript definitions
```

## Available Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Browser Support

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**Port already in use?**
Vite will automatically try the next available port (5174, 5175, etc.)

**Build errors?**
Delete `node_modules` and `package-lock.json`, then run `npm install` again.

**Types not working?**
Restart your TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

## License

MIT

## Contributing

Found a bug or want to add a feature? Feel free to open an issue or submit a PR.

---

Built by [Aishwary Dongre](https://github.com/aishwary-dongre) • Star it if you found it useful

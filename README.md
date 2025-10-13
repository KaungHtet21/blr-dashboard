# BLR Dashboard

A modern admin dashboard for BLR built with React, TypeScript, Ant Design, and Styled Components.

## Features

### 🔐 Authentication
- Login page with hardcoded credentials
- Session management with localStorage
- Protected routes

### 👥 Users Management
- Display users list with pagination
- Search users by email (Gmail or iCloud)
- Filter users by premium status
- Real-time data updates

### 👑 Give Premium
- Grant premium access to users
- Search functionality for finding specific users
- Confirmation modal for premium granting
- Visual feedback for premium status

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Ant Design** - UI components
- **Styled Components** - CSS-in-JS styling
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   └── organisms/      # Complex components (Navigation, Layout)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services and data management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Login Credentials
- **Email:** nox@gmail.com
- **Password:** admin123

## Usage

### Users Management
1. Navigate to "Users Management" from the sidebar
2. Use the search bar to find users by email
3. Use the premium filter to show only premium or free users
4. View user details in the table

### Give Premium
1. Navigate to "Give Premium" from the sidebar
2. Search for the user you want to grant premium access
3. Click "Give Premium" button next to the user
4. Confirm the action in the modal

## Features Overview

### 🔍 Search Functionality
- Search by email address (supports Gmail and iCloud domains)
- Real-time search with debouncing
- Case-insensitive search

### 🏷️ Filtering
- Filter by premium status (All, Premium, Free)
- Combine search and filter for precise results
- Reset filters functionality

### 📊 Data Display
- Responsive table with pagination
- Sortable columns
- Loading states and error handling
- User-friendly status indicators

### 🎨 UI/UX
- Modern, clean design
- Responsive layout
- Smooth animations and transitions
- Consistent color scheme
- Accessible components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- Atomic design principles
- Styled Components for styling
- ESLint for code quality

## Mock Data

The application uses mock data for demonstration purposes. In a real application, you would:

1. Replace the mock services with actual API calls
2. Implement proper authentication with JWT tokens
3. Add error handling and loading states
4. Implement real-time updates with WebSocket or polling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
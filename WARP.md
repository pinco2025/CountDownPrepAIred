# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CountDownPrepAIred is a React-based countdown landing page for the prepAIred AI study platform. It's built with modern web technologies including React 18, TypeScript, Vite, and Tailwind CSS, featuring a glass morphism design with animated countdown timer.

## Development Commands

### Core Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code using ESLint
npm run lint
```

### Package Management
```bash
# Install dependencies
npm install

# Add new dependency
npm install <package-name>

# Add dev dependency
npm install --save-dev <package-name>
```

### Development Server
The Vite dev server runs on `http://localhost:5173` by default with hot module replacement enabled.

## Architecture & Code Structure

### Application Architecture
- **Single-page React application** with countdown timer functionality
- **Component-based architecture** with main App component containing all logic
- **Real-time countdown** using `setInterval` with proper cleanup
- **Glass morphism UI** with Tailwind CSS custom classes
- **Responsive design** supporting mobile and desktop layouts

### Key Components

**App.tsx** (Main Component):
- Countdown timer logic with days/hours/minutes/seconds
- Launch date management (target: September 21st, 2025)
- Social media integration (Reddit, Discord)
- Loading states and expired state handling
- Responsive grid layout for timer display

**Styling System**:
- Custom CSS variables for glass morphism effects
- Tailwind CSS utility classes
- Custom animations for background gradients and timer pulses
- Inter font family imported via Google Fonts

### State Management
Uses React's built-in `useState` and `useEffect` hooks:
- `timeLeft`: Object tracking days, hours, minutes, seconds
- `isExpired`: Boolean for post-launch state
- `isLoading`: Boolean for initial loading state

### External Dependencies
- **React 18**: Core framework with modern hooks
- **Lucide React**: Icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety and development experience

### Build Configuration
- **Vite**: Fast build tool with React plugin
- **ESLint**: Linting with React Hooks and TypeScript rules
- **PostCSS**: CSS processing with Tailwind
- **TypeScript**: Strict type checking enabled

### Asset Management
- Logo stored in `/public/prepAIllogo.png`
- Assets served directly from public directory
- Vite handles asset optimization and bundling

### Browser Compatibility
- Modern ES2020+ features
- CSS Grid and Flexbox layouts
- CSS backdrop-filter for glass effects
- Responsive viewport meta tag

## Development Guidelines

### Code Patterns
- Functional components with hooks
- Custom CSS classes for reusable styles
- Proper TypeScript typing for props and state
- Accessibility considerations (focus styles, ARIA labels)
- Clean component lifecycle with useEffect cleanup

### Styling Conventions
- Glass morphism effects using CSS custom properties
- Tailwind utility classes for layout and spacing
- Custom animations defined in CSS
- Responsive design with mobile-first approach
- High contrast and reduced motion support

### Timer Implementation
The countdown uses precise interval calculations:
- Updates every 1000ms (1 second)
- Calculates difference between current time and target date
- Properly handles timezone considerations
- Includes proper cleanup to prevent memory leaks

### Social Integration
Handles external links with security considerations:
- `window.open()` with `noopener,noreferrer` flags
- Platform-specific URL mapping
- Error handling for invalid platforms

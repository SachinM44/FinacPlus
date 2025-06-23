# Yapple Music - Micro Frontend Application
A modern music library application built with React, TypeScript, Tailwindcss, and featuring micro-frontend architecture using Module Federation and role-based authentication system.

## Project Overview
This project demonstrates a complete micro-frontend implementation where the main application acts as a host container and dynamically loads a music library component from a separate deployment. The application includes authentication with role-based access control, allowing different user types to have varying levels of functionality.

## Live Demo Links
- Main Application (Host): https://venerable-kitsune-f53b87.netlify.app
- Music Library (Remote): https://rainbow-elf-0e6fe5.netlify.app

### Admin User
Email: admin@yapple.com
- Password: admin123
- Permissions: Full access - can view, add, and delete songs

### Regular User
- Email: user@yapple.com
- Password: user123
- Permissions: Read-only access - can view and filter songs only

## How to Run Locally
### Prerequisites
- Node.js 18
- npm or yarn package manager
- Git for version control

### Installation Steps
1. Clone the repository from GitHub:
   bash
   git clone https://github.com/SachinM44/FinacPlus.git
   cd FinacPlus
   ls

2. Install dependencies for the music library (remote app):
   bash
   cd music-library
   npm install

3. Install dependencies for the main application (host app):
   bash
   cd ../main-app
   npm install
   

4. Start the development servers:

   ->>Important: Start the music library first as the main app depends on it

   bash
   # Terminal/bashh 1 - Start music library on port 5001
   cd music-library
    npm run build
npm run preview -- --port 5001 --strictPort   
   

   
   # Terminal 2 - Start main app on port 5000
   cd main-app
   npm run dev

5. Access the applications for dev:
   - Main Application: http://localhost:5000
   - Music Library (standalone): http://localhost:5001



### Deployment 
The deployment follows a two-step process where the remote application must be deployed first to make its module federation entry point available to the host application...

### Step-by-Step Deployment Process
1. Music Library (Remote) Deployment:
   - Deployed to Netlify at: https://rainbow-elf-0e6fe5.netlify.app

2. Main Application (Host) Deployment:
   - Deployed to Netlify at: https://venerable-kitsune-f53b87.netlify.app

### Key Configuration Changes for Production
The main app's Vite configuration was updated to handle both development and production environments:

-->>const remoteUrl = isDev 
  ? 'http://localhost:5001/assets/remoteEntry.js'
  : 'https://rainbow-elf-0e6fe5.netlify.app/assets/remoteEntry.js';


## Micro Frontend Architecture Explanation

### Architecture Overview->
The application implements a micro-frontend pattern using Webpack Module Federation (via Vite plugin), allowing independent development and deployment of different application parts.

### Components
1. Host Application (Main App):
   - Acts as the shell/container application
   - Handles routing, authentication, and overall application state
   - Dynamically imports and renders the music library component
   - Manages user sessions and role-based access control

2. Remote Application (Music Library):
   - Standalone React application focused on music management
   - Exposes specific components through Module Federation
   - Can be deployed independently
   - Receives user context and permissions from the host

### Module Federation Setup

Music Library (Remote) Configuration:
- Exposes MusicLibrary component and main App component
- Shares React and React-DOM to avoid duplication
- Generates remoteEntry.js file for consumption

Main App (Host) Configuration:
- Consumes the music library remote
- Implements dynamic imports with React lazy loading
- Handles loading states and error boundaries

### Authentication Flow

The application uses a mock JWT authentication system stored in localStorage with role-based access control....

### Implementation Details
1. Authentication Context:
   - Uses React Context API to manage global auth state
   - Persists user session in localStorage
   - Provides login/logout functionality across the application

2. Role System:
   - Admin Role: Complete access to all features including CRUD operations on songs
   - User Role: Read-only access with filtering and sorting capabilities

3. Protected Functionality:
   - Song addition and deletion buttons only visible to admin users
   - API calls are role-validated before execution
   - UI components conditionally render based on user permissions

4. Security Measures:
   - JWT tokens expire after session
   - Role validation on both frontend and component level
   - Secure routing with authentication checks

### How Authentication Works
1. User enters credentials on login page
2. System validates against predefined user database
3. On successful login, JWT token is generated and stored
4. User role is extracted and stored in authentication context
5. Components check user role before rendering restricted features
6. Session persists until logout or token expiration

## Technical Features Implemented

### JavaScript Array Methods Usage

The application extensively uses modern JavaScript array methods:

 map(): Rendering song lists and transforming data structures
 filter(): Implementing search and filtering functionality by title, artist, and album
 reduce(): Aggregating data for statistics and grouping operations
 sort(): Ordering songs by different criteria (title, artist, release date)

## Testing the Application

### Testing Admin Features
1. Login with admin credentials
2. Navigate to the music library section
3. Add new songs using the "Add Song" button (as an admin only )
5. Delete songs using the delete button(as an admin only )
6. Verify all CRUD operations  will work ......

thank you ....... 

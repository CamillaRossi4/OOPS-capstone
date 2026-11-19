# OOPS!

OOPS! is a creative workspace designed for communication agencies and creative teams.

It helps organise projects, collect ideas, document revisions and feedback, and rediscover concepts that deserve a second chance.

## Live Application

Frontend: https://oops-capstone.vercel.app/

Backend: https://oops-backend-new.onrender.com/

## Features

- User registration and login
- Google authentication
- Project creation and management
- Idea library with categories and custom folders
- Idea revisions and version history
- Feedback tracking and breakpoint analysis
- Rediscovery of previous ideas
- Image uploads for projects and ideas
- Completed project archive
- Customisable workspace themes
- English and Italian interface

## Technologies

**Frontend**
- React
- Vite
- React Router
- CSS

**Backend**
- Node.js
- Express
- MongoDB

The frontend communicates with the backend through a REST API.

## Getting Started

Clone the repository and install the dependencies.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

**Backend**

```bash
cd backend
npm install
npm run dev
```

The backend must be running for the application to work correctly.

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

The backend also requires environment variables for the database connection, authentication and image uploads.

## Build

From the frontend directory:

```bash
npm run build
```

## Code Quality

From the frontend directory:

```bash
npm run lint
```

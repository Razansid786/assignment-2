# Event Management System

A React-based event management system using Redux Toolkit and the Ticketmaster Discovery API.

## Features

- User registration, login, and logout (frontend simulation with localStorage)
- Browse and search events from Ticketmaster
- Filter events by category
- View detailed event information
- Register for events (requires login)
- View and manage registered events (My Events)
- Distinguish between upcoming and past events
- Responsive design

## Tech Stack

- React.js (Vite)
- Redux Toolkit
- React Router v6
- Ticketmaster Discovery API

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Razansid786/assignment-2.git
   cd assignment-2/event-management
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `event-management` folder:
   ```
   VITE_TM_API_KEY=your_ticketmaster_api_key_here
   ```
   Get your API key from: https://developer.ticketmaster.com/

4. Run the development server:
   ```
   npm run dev
   ```

5. Open http://localhost:5173 in your browser.

## Project Structure

```
src/
  store/
    store.js              - Redux store configuration
    authSlice.js          - Authentication state
    eventsSlice.js        - Events state
    registrationsSlice.js - Event registrations state
  components/
    Navbar.jsx            - Navigation bar
    EventCard.jsx         - Event card component
    ProtectedRoute.jsx    - Route guard for logged-in users
  pages/
    Login.jsx             - Login page
    Register.jsx          - Registration page
    Events.jsx            - Event listing with search and filters
    EventDetail.jsx       - Individual event details
    MyEvents.jsx          - User's registered events
```

## Notes

- Authentication is simulated on the frontend using localStorage. No backend required.
- Do not commit your `.env` file. It is listed in `.gitignore`.
- Ticketmaster API allows 5,000 requests/day and 2 requests/second.

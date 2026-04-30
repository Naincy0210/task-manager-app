## TaskFlow Manager

This is a full-stack Team Task Manager application where users can create projects, assign tasks, and track progress. The system supports role-based access where admins can manage tasks and members can update their assigned work.

## Features

* User Authentication (Signup / Login)
* Role-based access (Admin / Member)
* Create and manage projects
* Task creation and assignment
* Task status tracking (pending / completed)
* Basic dashboard to view tasks

## Tech Stack

Frontend:

* HTML
* CSS
* JavaScript (Vite)

Backend:

* Node.js
* Express.js
* TypeScript

Database:

* MongoDB

## How to Run Locally

1. Clone the repository
2. Install dependencies

```
npm install
```

3. Setup environment variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

4. Start the server

```
npm run dev
```

5. Open in browser:

```
http://localhost:5173
```

## Project Structure

```
server/
  controllers/
  models/
  routes/
  middleware/

src/
  frontend files
```

## Live Demo

(Add your Railway link here after deployment)

## Demo Video

(Add your video link here)

## Notes

This project was built as part of a full-stack assignment to demonstrate understanding of:

* REST APIs
* Authentication
* Role-based access control
* Full-stack integration

## Future Improvements

* Better UI/UX
* Notifications system
* Real-time updates
* Task deadlines and reminders

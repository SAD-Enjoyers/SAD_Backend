# SAD_Enjoyers Backend Repository

Welcome to the **SAD_Enjoyers** backend repository! This is the backend service for our project, implemented in **JavaScript** using **Node.js** and **Express.js**.

## Overview

This backend handles various functionalities for the application, including API endpoints, database interactions, and business logic. It interacts with two databases:
- **PostgreSQL** as the main relational database
- **MongoDB** as a secondary, NoSQL database

The frontend and backend services are managed under the **SAD_Enjoyers** organization on GitHub, where this repository is one of two:
1. [Frontend Repository](https://github.com/SAD-Enjoyers/SAD_Frontend)
2. Backend Repository (this repository)

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- RESTful API built with Express.js
- PostgreSQL integration as the primary database
- MongoDB integration as a secondary database
- Secure authentication and authorization
- Error handling and logging with winston

## Project Structure

Repository structure is like this:

```
backend/
├── src/
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # Route definitions
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── config.ini        # Server configuration
│   └── server.js         # Main server file
├── db/
│   ├── schema/           # SQL schema files for PostgreSQL
│   ├── migrations/       # Migration files for database updates
│   └── seeds/            # Seed files for initial data
├── tests/                # Test files
├── README.md             # This file
└── package.json          # Dependencies and scripts
```

And also files store in */var/www/SADapp/uploads/* and strucure of it like this:

```
/uploads/
├── user_uploads/          
│   ├── user_123/
│   │   └── profile.jpg
│   └── service_123/
│       ├── image.png
│       ├── document.pdf
│       └── video.mp4
│
├── public/
└── logs/
```

## Technologies

- **Node.js** & **Express.js** - Core backend framework
- **PostgreSQL** - Main relational database
- **MongoDB** - Secondary NoSQL database

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SAD-Enjoyers/SAD_Backend
   cd backend
   ```

2. **Install dependencies:**
   - Install NodeJS version 20.18.0

   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Set values for your PostgreSQL and MongoDB connections, as well as any other required variables.

## Database Setup

### PostgreSQL
1. Ensure PostgreSQL is installed and running.
2. Run the schema SQL file to set up tables:

   ```bash
   psql -U <username> -d <database> -f db/schema/create_tables.sql
   ```

3. Run any seed files to populate initial data.

### MongoDB
1. Ensure MongoDB is installed and running.
2. Connect using your connection string specified in `.env`.

## Usage

- **Start the server**:

  ```bash
  npm start
  ```

- The API will be accessible at `http://localhost:3000` (or your specified port).

## Contributing

We welcome contributions to this project! Please follow these steps:

1. Fork this repository.
2. Create a new branch with a descriptive name.
3. Make changes and commit.
4. Submit a pull request for review.

---

Thank you for being a part of **SAD_Enjoyers**!

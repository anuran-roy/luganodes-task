# Luganodes Task

This is the (broken) submission for the LugaNodes SDE Development Task 4. The Task was to allow for a seamless authentication process for the user, and to allow for the user to be able to view their profile information. The authentication should support Web3 Authentication using MetaMask Wallet as well as Username Password.

## Features

- [x] User Registration and Login
- [x] Web3 Authentication Integration
- [x] JWT-Based Session Management
- [x] Secure Storage of Credentials
- [x] Authentication Portability
- [x] User Dashboard
- [ ] Account Recovery Mechanism
- [ ] Google OAuth Integration

## Tech Stack

- MongoDB
- Mongoose
- ExpressJS
- ReactJS
- Moralis
- PassportJS

## Installation

### Getting API Keys

For Web3 Authentication, we use Moralis. We need to get a Moralis API Key and add it to the `.env` file first. The `.env` file can be created from the `.env.example` file. The Moralis API Key can be obtained from [Moralis](https://moralis.io/)


### Running the Frontend

**DO NOTE** that the frontend runs on port 3001 and not 3000, and the backend runs at port 4000.

You first need to define the environment variables in the `.env` file. The `.env` file can be created from the `.env.example` file. The `REACT_APP_BACKEND_URL` variable should be set to the URL of the backend server.

To run the frontend, just run the following commands:

```bash
cd frontend
npm i
npm start
```

### Running the Backend

You first need to define the environment variables in the `.env` file. The `.env` file can be created from the `.env.example` file. A sample .env file would look like this:

```bash
APP_DOMAIN=luganodes.work
MORALIS_API_KEY=YOUR_MORALIS_API_KEY
REACT_URL=http://localhost:3001
AUTH_SECRET=1234
DB_STRING=MONGODB_CONNECTION_STRING
```

The backend can be run using the following command:

```bash
cd backend/javascript
npm i -g nodemon
npm i
nodemon index.js
```

## Endpoints

### Frontend

1. `/` -> the Home component (unauthenticated)
2. `/signin` -> The signin component (unauthenticated)
3. `/onboarding` -> The onboarding component (authenticated)
4. `/user` -> The user component (authenticated)
   
The flow works like this:

```mermaid
graph LR
A[Home] --> B[Signin]
B --> |AutoDetect New user| C[Onboarding]
B -->|Old user Detected| D[User Profile]
C --> |1| E[Create new User in Backend]
E --> |2| C
C --> D
```

### Backend
Endpoints:

- `/request-message` (POST): Receives a request message containing address, chain, and network and returns a message that the client needs to sign to confirm their identity using Moralis Auth.

- `/verify` (POST): Verifies the signed message received from the client; if it's a wallet login, it checks the user's wallet address against the database, creates a JWT token, and returns the user data and login status. If it's a username-password login (currently not implemented), it will perform the appropriate actions.

- `/authenticate` (GET): Verifies the JWT token sent in the request cookie and returns the user data if the token is valid; otherwise, returns a 403 (Forbidden) status code.

- `/signup` (POST): Receives user data from the client and creates a new user in the database using the createUser function.

- `/logout` (GET): Clears the JWT token cookie, effectively logging out the user, and returns a 200 (OK) status code.
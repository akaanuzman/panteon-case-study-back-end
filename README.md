# Leaderboard API Service

**Hello Panteon Games Team!**

I am delighted to have successfully completed this case study in line with the specified requirements. Throughout the process, I made sure to implement all the requested features. However, there is one aspect I was unable to complete: deploying the projects to a live environment.

Initially, my plan was to Dockerize each component separately and deploy them on a server. Unfortunately, I encountered unexpected challenges and was unable to finalize this process. Nevertheless, I hope that my work meets your expectations.

I wish you an enjoyable review of my case study and look forward to your feedback with great enthusiasm.

Thank you!

## 🚀 Features

- Top players ranking system
- Player search functionality with surrounding rankings
- Weekly leaderboard reset automation
- Prize pool distribution system
- Autocomplete search for player names
- Rate limiting for API protection
- Redis-based caching for high performance
- Automated player seeding for testing

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- Redis
- MySQL
- Rate Limiting
- Logging

## 📚 API Documentation

### Base URL
```
/api
```

### Endpoints

#### 1. Get Top Players
```http
GET /api/leaderboard/top
```
Returns the top 100 players in the leaderboard.

**Response**
- Status: 200 OK
- Body: Array of top players with their rankings and scores

#### 2. Search Player Ranking
```http
GET /api/leaderboard/search?username=test
```
Search for a specific player and get their ranking along with surrounding players.

**Query Parameters**
- `username`: Player's username to search for

**Response**
- Status: 200 OK
- Body: Player's ranking and surrounding players' information

#### 3. Reset Weekly Leaderboard
```http
POST /api/leaderboard/reset
```
Resets the weekly leaderboard and distributes prizes to top players.

**Response**
- Status: 200 OK
- Body: Reset confirmation and prize distribution details

#### 4. Get Prize Pool
```http
GET /api/leaderboard/prize-pool
```
Retrieves the current prize pool information.

**Response**
- Status: 200 OK
- Body: Prize pool details and distribution information

#### 5. Autocomplete Search
```http
GET /api/leaderboard/autocomplete?q=test
```
Provides autocomplete suggestions for player usernames.

**Query Parameters**
- `q`: Partial username to search. Works with minimum three characters and performance may decrease as more characters are added!

**Response**
- Status: 200 OK
- Body: Array of matching username suggestions

#### 6. Seed Players (Development Only)
```http
POST /api/seed-players
```
Seeds the database with 10 million test players (development environment only).

**Response**
- Status: 200 OK
- Body: Seeding confirmation

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:
- Endpoints: 50 requests per minute

## 🏗 Project Structure

```
src/
├── config/         # Configuration files
├── constants/      # Project constants
├── controllers/    # Request handlers
├── enums/          # Enumeration types
├── helpers/        # Utility functions
├── middlewares/    # Express middlewares
├── models/         # Data models
├── router/         # API routes
├── services/       # Business logic
└── logs/          # Application logs
```

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
PORT=your_port
MYSQL_HOST=your_host
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database_name
```

4. Start the development server:
```bash
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file root directory with the following variables:
- Set environment variables in `.env`
  * Set `PORT = <YOUR_PORT>`
  * Set `MYSQL_HOST = <YOUR_MYSQL_HOST>`
  * Set `MYSQL_USER = <YOUR_MYSQL_USER>`
  * Set `MYSQL_PORT = <YOUR_MYSQL_PORT>`
  * Set `MYSQL_PASSWORD = <YOUR_MYSQL_PASSWORD>`
  * Set `MYSQL_DATABASE = <YOUR_MYSQL_DATABASE>`

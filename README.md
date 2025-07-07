![Alt text](https://res.cloudinary.com/drcbqssyo/image/upload/v1751884113/CryptEx_m48j9k.png)


# CryptEx

CryptEx is a high-performance cryptocurrency exchange platform designed for speed, reliability, and scalability. It enables users to trade digital assets in real-time with a modern, responsive interface and robust backend infrastructure.

## Project Description

CryptEx is built to provide a seamless trading experience, supporting order placement, cancellation, real-time order book updates, and balance management. The platform leverages modern technologies to ensure low latency and high throughput, making it suitable for both retail and professional traders.

In addition to the core exchange, we have also created a **proxy server** that connects the website to the [backpack.exchange](https://backpack.exchange) API as well as the WebSocket server. This allows CryptEx to integrate external market data and trading functionality, providing users with a unified and enhanced trading experience.

## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next-20232A?style=for-the-badge&logo=nextdotjs&logoColor=61DAFB" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSocket" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
</p>


- **Frontend:** NextJS  
- **Backend:** Node.js (Express)  
- **Database:** PostgreSQL  
- **Real-time Communication:** WebSocket  
- **Caching & Messaging:** Redis  
- **Proxy Server:** Node.js-based proxy to connect with backpack.exchange API and WebSocket server

## Features

- User authentication and management
- Real-time order book and trade updates
- Place and cancel orders instantly
- View open orders and balances
- Scalable microservices architecture
- Proxy server for seamless integration with backpack.exchange API and WebSocket server

## Getting Started

1. **Clone the repository**
   ```
   git clone https://github.com/SajalDBansal/cryptex-exchange.git
   ```

2. **Install dependencies**
   ```
   cd exchange-backend
   npm install
   cd ../exchange-frontend
   npm install
   cd ../proxy-server
   npm install
   ```

3. **Configure environment variables**  
   Set up your `.env` files for backend, frontend, and proxy server with the necessary configuration (database URL, Redis connection, API keys, etc.).
   

4. **Run the backend OR proxy server**
   ```
   cd exchange-backend
   npm run dev
   ```
   ```
   cd ../proxy-server
   npm start
   ```

5. **Run the market engine**
   ```
   cd ../market-engine
   npm install
   npm start
   ```

6. **Run the frontend**
   ```
   cd ../exchange-frontend
   npm start
   ```

## Architecture Overview

- **React** powers the user interface, providing a dynamic and responsive trading dashboard.
- **Node.js** with Express handles API requests, user authentication, and business logic.
- **PostgreSQL** stores user data, orders, and trade history.
- **WebSocket** enables real-time updates for order books and trades.
- **Redis** is used for caching, pub/sub messaging, and as a fast in-memory data store for the matching engine.
- **Proxy Server** bridges the frontend with the backpack.exchange API and WebSocket server, enabling external market data and trading capabilities.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.



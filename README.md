# 🚀 PulseTalk Client

**PulseTalk Client** is a modern real-time chat application frontend built with **Next.js**, **React**, **Apollo Client**, **TailwindCSS**, **React Hook Form** and **Zustand**. It serves as the user-facing interface for interacting with the PulseTalk API and provides seamless real-time messaging with GraphQL subscriptions and Redis-powered pub/sub.

---

## ✨ Features

- ⚡ Real-time messaging via WebSockets & GraphQL Subscriptions
- 🧵 Chat room creation, joining, and management
- 👤 JWT-based user authentication and authorization
- 🟢 Live user presence and typing indicators via Redis
- 🧩 Modular and scalable Next.js architecture
- ⚛️ Smooth state management using Zustand

---

## 🛠 Tech Stack

| Area               | Technology                |
| ------------------ | ------------------------- |
| Frontend Framework | **Next.js**               |
| UI Library         | **React**                 |
| State Management   | **Zustand**               |
| API Integration    | **Apollo Client**         |
| Real-Time          | **WebSockets**            |
| Subscriptions      | **GraphQL Subscriptions** |
| Pub/Sub Layer      | **Redis**                 |
| Auth               | **JWT**                   |

---

## 📦 Getting Started

### 🔧 Prerequisites

- Node.js v20+
- TypeScript v5+
- Yarn or npm
- Active instance of [PulseTalk API](https://github.com/miyushan/pulse-talk-api)

---

### 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/miyushan/pulse-talk-client
   cd pulse-talk-client

   ```

2. **Install dependencies**
   `npm install`

3. **Configure environment variables (.env.local fle content)**
   ```
   NEXT_PUBLIC_API_HOST=api_url
   ```

### 🧪 Development

1. **To run the client in development mode:**
   `npm run dev`

### 📦 Production

1. **Build the application:**
   `npm run build`

2. **Start the application:**
   `npm run start`

3. **Client Endpoints:**
   ```
    http://localhost:3000/sign-in
    http://localhost:3000/register
    http://localhost:3000/chat
   ```

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NextJS — Progressive React Framework

- React — For building interactive UIse

- Apollo Client — GraphQL Client for React

- Zustand — Bear necessities for state management

- React Hook Form — Efficient form validation

- Redis — In-memory pub/sub engine

- GraphQL — Flexible and powerful API design

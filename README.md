# 🌐 Sphere Frontend

The official frontend for **Sphere** a modern community and news platform built with React, Vite, and Tailwind CSS.

## ✨ Features

- 🔐 JWT Authentication (Login & Register)
- 🏠 Home Feed — posts from all communities
- 🏘️ Communities — create, join, browse
- 📝 Posts — create, vote, comment
- 💬 Nested Comments
- 📰 News Feed — categories & search
- 🤖 AI Insights powered by Groq
- 🔔 Real-time Notifications via WebSocket
- 💌 Direct Messages — real-time DMs
- 👤 User Profiles — follow, block
- 🌙 Dark UI — black & white theme

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| Tailwind CSS | Styling |
| Axios | API Calls |
| React Router v7 | Navigation |
| SockJS + StompJS | WebSocket / Real-time |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Sphere Backend running on `http://localhost:8080`

### Installation
```bash
# Clone the repo
git clone https://github.com/Sumeet-Y1/Sphere-Frontend.git
cd Sphere-Frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📁 Project Structure
```
src/
├── api/            ← Axios instance & API calls
├── components/     ← Reusable components (Navbar, etc.)
├── context/        ← Auth context
├── hooks/          ← Custom hooks
├── pages/
│   ├── Auth/       ← Login & Register
│   ├── Home/       ← Main feed
│   ├── Community/  ← Communities
│   ├── Post/       ← Post detail & create
│   ├── Profile/    ← User profile
│   ← News feed
│   └── DM/         ← Direct messages
└── utils/          ← Helper functions
```

## 🔌 Backend

This frontend connects to the Sphere Spring Boot backend.

Backend repo: [Sphere](https://github.com/Sumeet-Y1/Sphere)

## 👨‍💻 Author

Built with ❤️ by Sumeet

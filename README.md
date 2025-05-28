# Chat Application

A real-time chat application built with Spring Boot, React, and Tailwind CSS. It supports secure authentication, group messaging, and rich media file sharing, and leverages AI for intelligent responses.

## 🚀 Features

* **User Authentication**: JWT-based auth, OAuth2 (Google), and Bcrypt password encoding for robust security.
* **Real-time Messaging**: STOMP over WebSocket for instant one-on-one and group chats.
* **AI-powered Replies**: Integrated with Gemini API via WebClient for intelligent AI responses.
* **Media Sharing**: Supports uploading images and all binary file types to Cloudinary (text chat content is persisted in MongoDB).
* **Forgot Password**: OTP-based password reset using JavaMailSender.
* **Responsive Frontend**: Mobile-first design with Tailwind CSS and React.
* **State Management**: Redux Toolkit and async thunks for predictable state updates.
* **Deployment**: Frontend on Vercel; Backend on Render; Database hosted on MongoDB Atlas.

## 🏗️ Tech Stack

### Backend

* **Java Version**: 21
* **Framework**: Spring Boot
* **Security**: Spring Security, JWT, OAuth2, Bcrypt
* **WebSocket**: STOMP protocol
* **AI Integration**: WebClient for Gemini API calls
* **Email**: JavaMailSender for OTP delivery
* **Storage**:

  * **Database**: MongoDB Atlas
  * **Media**: Cloudinary

### Frontend

* **Framework**: React
* **Styling**: Tailwind CSS (mobile-first)
* **Routing**: React Router
* **State**: Redux Toolkit&#x20;
* **Auth**: Google Authenticator, WebSocket client
* **Deployment**: Vercel

## 🛠️ Architecture Overview

Below is a breakdown of the system’s main components, their responsibilities, and the flow of data throughout the chat application.

### 1. Client (React + Tailwind CSS)

* **Responsibilities**: Renders the UI for login, chat rooms, direct messages, and settings.
* **Communication**:

  * **REST (HTTPS)**: Authentication, user/group management.
  * **WebSocket (STOMP)**: Real‑time send/receive of chat messages and presence updates.

### 2. API & Security Layer (Spring Boot + Spring Security)

* **Responsibilities**:

  * Handles login/logout, token issuance (JWT), and OAuth2 (Google) flows.
  * Secures all REST and WebSocket endpoints.
* **Details**:

  * **Bcrypt**: Password hashing.
  * **JWT**: Stateless session tokens.

### 3. Chat Service (Spring Boot)

* **Responsibilities**:

  * Exposes REST controllers for user profiles, group creation, file uploads.
  * STOMP/WebSocket controllers for broadcasting messages to private and group topics.
  * Integrates with Gemini API (via WebClient) to generate AI-powered bot replies.

### 4. Notification Service (Spring Boot)

* **Responsibilities**:

  * Sends OTP emails for password reset using JavaMailSender.

### 5. Data Storage

* **MongoDB Atlas**: Persists all JSON/text data — user profiles, chat messages, group metadata.
* **Cloudinary**: Stores all non‑text binary files (images, videos, documents).

### 6. Deployment Infrastructure

* **Frontend**: Vercel (static React build).
* **Backend**: Render.com (Java services).
* **Database**: MongoDB Atlas (fully managed cluster).

### Data Flow

```text
  +---------------+      HTTPS       +-----------------------+
  | React Client  | <--------------> | API & Security Layer  |
  | (Browser)     |  REST + WS(STOMP)         (Spring Boot)     |
  +-------+-------+                     +-------+---------+
          | REST calls                         |            
          | for auth, profiles, groups         | WebSocket    
          |                                     | STOMP msgs  
          v                                     v            
  +-------+-------+                     +-------+---------+
  | Chat Service  |                     | Notification    |
  | (Spring Boot) |                     | Service         |
  +-------+-------+                     +-------+---------+
          |                                     |            
          | MongoDB JSON/text data             | Email OTP   
          |                                     |            
          v                                     v            
  +-------+-------+                     +-------+---------+
  | MongoDB Atlas |                     |  External Mail  |
  +---------------+                     +-----------------+
          |
          | Binary file URLs
          v
  +---------------+
  |  Cloudinary   |
  +---------------+
```

* **Authentication**: Client obtains JWT (or OAuth2 token). All subsequent calls include token header (REST) or CONNECT headers (WebSocket).
* **Messaging**: Chat Service uses STOMP topics (`/topic/private.{userId}`, `/topic/group.{groupId}`) to push incoming and AI-generated messages.
* **Media Upload**: Frontend uploads files via Chat Service endpoints; service streams to Cloudinary and returns the file URL.
* **Persistence**: All chat records and metadata stored as JSON documents in MongoDB Atlas; binary file URLs reference Cloudinary.

This design ensures strong separation of concerns, horizontal scalability, and efficient real-time communication.

### Prerequisites

* Java 21
* Node.js (latest LTS)
* MongoDB Atlas account
* Cloudinary account
* Google OAuth credentials

### Clone the Repository

```bash
git clone https://github.com/rohit-0000/chatApp.git
cd chat-app
```

### Backend Setup

```bash
cd backend
./mvnw clean install
# Configure application.yml with MongoDB, Cloudinary, OAuth2, JWT, email
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
# Update .env with API endpoints and Google OAuth
npm run dev
```

## 🚀 Deployment

* **Frontend**: Deploy `frontend` folder to Vercel.
* **Backend**: Deploy `backend` to Render as a Java service.
* **Database**: Use MongoDB Atlas cluster.

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes and enhancements.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

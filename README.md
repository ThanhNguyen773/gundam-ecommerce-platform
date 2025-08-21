
# Gundam 3D E-Commerce Web Application

## Project Overview
This project is a **modern web-based e-commerce platform** focused on selling Gundam model kits, featuring **interactive 3D model visualization** directly in the browser. It provides an immersive shopping experience and integrates advanced AI technologies for **voice-based** and **image-based product search**, along with a **customer support AI chatbot**.

---

## Key Features
- **Interactive 3D Gundam Models** rendered in-browser using **Three.js**.
- **Voice-based Product Search** via **React Speech Recognition**.
- **Image-based Product Search** using **Hugging Face ViT**.
- **Secure Online Payments** through **Stripe**.
- **Product, Order, and User Management**.
- **Efficient Media Handling** with **Cloudinary**.
- **Frontend State Management** via **Zustand**.
- **Performance Optimization** using **Redis**.
- **AI-powered Customer Support** with **Dialogflow Chatbot**.

---

## Project Structure
backend/
├─ models/          # Mongoose models
├─ routes/          # API routes
├─ controllers/     # Business logic
├─ utils/           # Helper functions
├─ server.js        # Entry point

frontend/
├─ src/
│  ├─ components/   # React components
│  ├─ pages/        # Page views
│  ├─ stores/       # Zustand stores
│  ├─ hooks/        # Custom hooks
│  ├─ App.jsx       # Entry point

## System Architecture

### Backend
- **Node.js + Express.js**: Handles user requests, business logic, and database management.
- Provides **RESTful APIs** for frontend communication.

### Frontend
- **React.js + Tailwind CSS**: Modern, responsive, and device-friendly UI.
- Displays 3D models, product search, payment, and shopping cart features.

### Database
- **MongoDB**: Stores users, products, orders, discount codes, and other system data.

## Technology Stack
Node.js, Express.js, React.js, Tailwind CSS, Three.js, MongoDB, Redis, Stripe, Cloudinary, Zustand, Axios, React Speech Recognition, Hugging Face ViT, Dialogflow


### Supporting Technologies
- **Cloudinary**: Upload and manage product images efficiently.
- **Stripe**: Secure online payments.
- **React Speech Recognition**: Voice search functionality.
- **Hugging Face ViT**: Image-based product recognition.
- **Redis**: Temporary data storage for performance and load reduction.
- **Zustand**: Lightweight frontend state management.
- **Axios**: HTTP client for frontend-backend communication.
- **Dialogflow**: AI chatbot for automated customer support.


## Future Enhancements
- Interactive 3D demo on GitHub Pages
- AI-powered recommendations
- Multi-language support


## Author
- Nguyen Dang Thanh - 
- Thesis: Developing a web application for selling Gundam models with integrated 3D 
visualization 
- University: [College of Information and Communication Technology, Can Tho University]




---





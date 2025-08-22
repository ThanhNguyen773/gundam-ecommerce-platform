
# Gundam 3D E-Commerce Web Application

## Project Overview
This project is a **modern web-based e-commerce platform** focused on selling Gundam model kits, featuring **interactive 3D model visualization** directly in the browser. It provides an immersive shopping experience and integrates advanced AI technologies for **voice-based** and **image-based product search**, along with a **customer support AI chatbot**.

---

### HomePage
<img width="1824" height="873" alt="image" src="https://github.com/user-attachments/assets/46fe6b88-b558-42bc-a164-5ce9e27cc47b" />

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
```markdown
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

```

## System Architecture

### Backend
- **Node.js + Express.js**: Handles user requests, business logic, and database management.
- Provides **RESTful APIs** for frontend communication.

### Frontend
- **React.js + Tailwind CSS**: Modern, responsive, and device-friendly UI.
- Displays 3D models, product search, payment, and shopping cart features.

### Database
- **MongoDB**: Stores users, products, orders, discount codes, and other system data.

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

## 🔧 Environment Configuration (.env)

Before running the backend, create a `.env` file in the project root and fill in the following environment variables:

```dotenv
# Server config
PORT=5000                             # Port for backend server
MONGO_URI=mongodb://localhost:27017/*****  # MongoDB connection URI
appName=Gundam3DStore                 # Application name

# Redis (Upstash)
UPSTASH_REDIS_URL=redis://default:xxxxx@xxx.upstash.io:6379

# JWT secrets
ACCESS_TOKEN_SECRET=your_access_token_secret       # Secret key for Access Token
REFRESH_TOKEN_SECRET=your_refresh_token_secret     # Secret key for Refresh Token

# Cloudinary config (image upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe config (payment)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx

# HuggingFace (AI - image search / NLP)
HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Dialogflow / OAuth
GOOGLE_CREDENTIALS_PATH=   # Credentials file downloaded from Google Cloud
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Client config
CLIENT_URL=http://localhost:****          # Frontend URL (React app)
```


## Author
**Nguyen Dang Thanh**  
Thesis: Developing a web application for selling Gundam models with integrated 3D visualization  
University: College of Information and Communication Technology, Can Tho University





---









# 🏡 WanderLust

WanderLust is a full-stack **Airbnb-style listing application** where users can browse, create, edit, and review property listings. The project follows the **MVC (Model-View-Controller)** architecture and is built using the Node.js/Express ecosystem with MongoDB as the database.

---

## ✨ Features

- 🔐 User authentication (Sign up, Log in, Log out) using Passport.js
- 🏠 Create, view, edit, and delete property listings
- 🖼️ Image upload and management via Cloudinary (with old-image cleanup on update/delete)
- ⭐ Add and delete reviews with ratings on listings
- 🔑 Authorization checks — only the listing owner can edit/delete their own listings; only review authors can delete their own reviews
- ✅ Server-side form validation using Joi
- 💬 Flash messages for user feedback (success/error states)
- 📱 Responsive UI built with Bootstrap

---

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- EJS (Embedded JavaScript templating) + `ejs-mate` for layouts

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose (ODM)

**Authentication**
- Passport.js (`passport-local`, `passport-local-mongoose`)

**File Uploads / Media**
- Multer
- Cloudinary (`multer-storage-cloudinary`)

**Validation**
- Joi

**Architecture**
- MVC (Model–View–Controller)

---

## 📂 Project Structure

```
WanderLust/
├── controllers/          # Business logic (handles requests, talks to models)
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── init/                 # Database seeding scripts
│   ├── data.js
│   └── index.js
│
├── models/               # Mongoose schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/               # Static assets
│   ├── css/
│   │   ├── rating.css
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── routes/               # Express route definitions
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── uploads/              # Local upload handling (Multer temp storage)
│
├── utils/                # Helper utilities
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── views/                # EJS templates (UI)
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   ├── users/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   └── error.ejs
│
├── app.js                 # Entry point of the application
├── cloudConfig.js         # Cloudinary configuration
├── joi_schema.js          # Joi validation schemas
├── middleware.js          # Custom middleware (auth checks, validation, ownership)
├── package.json
├── package-lock.json
└── .env                   # Environment variables (not committed)
```

---

## 🧩 MVC Architecture Overview

| Layer | Responsibility | Location |
|---|---|---|
| **Model** | Defines data structure & talks to MongoDB | `models/` |
| **View** | Renders the UI shown to the user | `views/` |
| **Controller** | Contains the logic that connects routes to models and sends responses | `controllers/` |

Routes (`routes/`) map incoming HTTP requests to the appropriate controller function, keeping logic separated and the codebase maintainable.

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB installed)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/WanderLust.git
cd WanderLust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

In the root directory, create a `.env` file and add the following:

```env
ATLAS_DB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret_key

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

### 4. (Optional) Seed the database with sample listings

```bash
node init/index.js
```

### 5. Run the application

```bash
node app.js
```

or, if you're using nodemon for auto-restart during development:

```bash
nodemon app.js
```

### 6. Open in browser

```
http://localhost:8080
```

(Adjust the port if your `app.js` listens on a different one.)

---

## 🔑 Environment Variables Reference

| Variable | Description |
|---|---|
| `ATLAS_DB_URL` | MongoDB Atlas connection string |
| `SECRET` | Secret key used for session/cookie signing |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |

---

## 🚀 Future Improvements

- Deploy live (e.g. on Render/Railway) with production-ready environment configs
- Add search and filter functionality for listings
- Add pagination for listings page
- Add map integration for listing locations
- Add unit/integration tests

---

## 🙏 Acknowledgements

Built as part of a structured full-stack web development learning path, applying core concepts of Express, MongoDB, authentication, and cloud-based media handling.

---

## 📄 License

This project is for educational purposes.
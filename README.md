
-----

````markdown
# 🔗 Full Stack URL Shortener

> **🚧 PROJECT STATUS: ONGOING / WORK IN PROGRESS 🚧**
>
> *Basic core features (Shortening, Redirection, Auth, Analytics) are completed and functional.*
> *However, this project is actively being developed. New features, UI enhancements, and performance optimizations are currently being added.*

## 📋 Overview

This is a robust, full-stack URL shortening application designed to provide users with the ability to shorten long URLs, manage their links, and view detailed analytics. The project consists of a **Spring Boot** backend handling logic and security, and a **React (Vite)** frontend providing a responsive user dashboard.



## ✨ Features

### ✅ Completed & Functional
* **User Authentication:** Secure Registration and Login using **JWT (JSON Web Tokens)**.
* **URL Shortening:** logic to map long URLs to unique short strings.
* **Redirection:** Instant redirection from short URLs to original URLs (HTTP 302).
* **User Dashboard:** View a list of all shortened URLs managed by the logged-in user.
* **Analytics:**
    * Track total clicks per URL.
    * Visual graphs showing click history over time (integration with **Chart.js**).
    * Date-range filtering for analytics.
* **CRUD Operations:** Edit URL settings and Delete URLs.

### 🚀 Upcoming / In Progress
* QR Code generation for shortened links.
* Rate limiting and advanced security headers.
* Exporting analytics data to CSV.
* Enhanced UI/UX animations and dark mode support.
* Containerization (Docker support).

## 🛠️ Tech Stack

### Backend (Java / Spring Boot)
* **Language:** Java 17
* **Framework:** Spring Boot 3.x
* **Security:** Spring Security, JWT (jjwt 0.12.6)
* **Database:** MySQL (Production), H2 (Optional for Dev)
* **ORM:** Spring Data JPA (Hibernate)
* **Utilities:** Lombok

### Frontend (React)
* **Framework:** React 19 (Vite)
* **UI Library:** Material UI (@mui/material), Emotion
* **State/Data Management:** @tanstack/react-query, Context API
* **Charts:** Chart.js, react-chartjs-2
* **Routing:** React Router DOM v7
* **HTTP Client:** Axios

## 📂 Project Structure

The project is divided into two main directories:

```text
root/
├── url-shortener-sb/       # Backend (Spring Boot Application)
│   ├── src/main/java...    # Controllers, Services, Models, Security
│   └── pom.xml             # Maven dependencies
│
└── url-shortener-react/    # Frontend (React Application)
    ├── src/components...   # Dashboard, Auth, Landing Page
    ├── src/api...          # Axios setup
    └── package.json        # Node dependencies
````

## ⚙️ Getting Started

### Prerequisites

  * **Java 17** or higher
  * **Node.js** (v18+ recommended)
  * **MySQL** Database

### 1\. Backend Setup (`url-shortener-sb`)

1.  Navigate to the backend folder:
    ```bash
    cd url-shortener-sb
    ```
2.  Configure your database in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/urlshortenerdb
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server will start on `http://localhost:8080`.

### 2\. Frontend Setup (`url-shortener-react`)

1.  Navigate to the frontend folder:
    ```bash
    cd url-shortener-react
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will run on `http://localhost:5173` (or similar).

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/public/register` | Register a new user |
| **POST** | `/api/auth/public/login` | Login and receive JWT |
| **POST** | `/api/urls/shorten` | Create a new short URL |
| **GET** | `/api/urls/myurls` | Get all URLs for logged-in user |
| **GET** | `/api/urls/analytics/{shortUrl}` | Get analytics for a specific URL |
| **GET** | `/api/urls/totalClicks` | Get total clicks across all URLs |
| **GET** | `/{shortUrl}` | Redirect to the original URL |

## 🤝 Contributing

Since this project is **ongoing**, suggestions and pull requests are welcome\!

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

-----

*Created by ANAS AJMERI*

```

---

```
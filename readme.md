# Flask + React Full Stack Application

**Authentication in Flask using Session & JWT**

## 🌟 Introduction

Built with the Flask in backend and React in frontend. Simple showcase how work different tech stacks.

## ⚙️ Tech Stack

- Flask
- Python
- React
- Node.js
- MySQL

## 🔋 Features

- 🌟 Tech stack: Flask + React + Node.js + MySQL
- 🎃 Authentication && Authorization with Session & JWT
- 👾 Handling API in frontend using axios
- 👌 Global state management with using React Context
- 🐞 Error handling both on the server and on the client
- 👻 One to one relation handling between user and post
- ⭐ Taking all production ready approach in Flask Full Stack
- ⏳ And much more!

## ⭐ Quick Start

_Make sure you have the following installed on your machine:_

- [Git](https://git-scm.com/)
- [Python](https://www.python.org/)
- [pip](https://pypi.org/project/pip/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)

## 🚀 Setup Instructions

**Clone This Repository**

```bash
git clone https://github.com/shekharsikku/flask-react
```

**Create Virtual Environment**

_Make sure you are in root dir of project:_

```bash
python -m venv .venv
```

**Activate Virtual Environment**

```bash
source .venv/Scripts/activate
```

**Install Required Modules**

```bash
python -m pip install -r requirements.txt
```

**Install Node Modules**

_Install all node_modules packages for frontend_

```bash
cd client
npm install
```

**Environment Variables Setup**

_Change, **.env.sample** filename to **.env** and add all required fields._

```env
# Server Environment Variables

MYSQLDB_URI=""
SECRET_KEY=""
JWT_SECRET=""
TOKEN_EXP=""
CORS_ORIGIN="*"
SERVER_MODE="development"

# Client Environment Variables

DEBUG_SERVER="http://localhost:8070"
WSGI_SERVER="http://localhost:8080"
```

_Token Exp should be minutes in number like 1, 5,.._  
_Set all cors origin in a string format separated by space: E.g. "http://localhost:5173 http://localhost:4173"_  
_Server mode should be - development/deployment_

**Start Development Server**

_Here we are using npm to run both frontend and backend together using the package.json file that are in root dir_

```bash
npm run dev
```

_It will run and start your flask backend and react frontend concurrently_

**Preview Your Frontend**

_For Debug Mode - if server mode is development_

```bash
http://localhost:5173
```

_For WSGI Server - if server mode is deployment_

```bash
http://localhost:5173
```

**Test Api Endpoints**

_You need tools like **Postman**, **ApiDog** or you can use Visual Studio Code extension **Thunder Client**._

**Use proxy for test Api endpoints**

_For Debug Mode - if server mode is development_

```bash
http://localhost:8070
```

_For WSGI Server - if server mode is deployment_

```bash
http://localhost:8080
```

### 🪄 Code by Shekhar Sharma

---

### License

This project is licensed under the MIT License - see the [license](license) file for details.

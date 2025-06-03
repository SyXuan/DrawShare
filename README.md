# DrawShare

A simple web application for drawing and sharing artwork, allowing users to draw on a canvas and upload their creations to the server for sharing.

## Features

- User name input
- Canvas with color selection and clear functionality
- Ability to download the current canvas
- Upload to server with success/failure feedback and retry option

## Tech Stack

### Frontend

- HTML5 Canvas
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- SQLite
- EJS (Template Engine)

## Installation and Running

### Prerequisites

- Node.js (v14+) and npm
- OR Docker and Docker Compose

### Installation Steps

#### Option 1: Traditional Installation

1. Clone or download this project

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the server

   ```bash
   npm start
   ```

   Or use development mode (auto-restart)

   ```bash
   npm run dev
   ```

4. Access the application
   Open your browser and visit http://localhost:3000

#### Option 2: Using Docker Compose

1. Clone or download this project

2. Start the application using Docker Compose

   ```bash
   docker compose up
   ```

   Or run in detached mode

   ```bash
   docker compose up -d
   ```

3. Access the application
   Open your browser and visit http://localhost:3000

4. To stop the application

   ```bash
   docker compose down
   ```

## API Documentation

### Upload Image

- **URL**: `/upload`
- **Method**: POST
- **Request Body**:
  - `image`: Image file
  - `name`: Username
- **Response**:

  ```json
  {
    "success": true,
    "imageId": 1,
    "message": "Image uploaded successfully"
  }
  ```

### Get All Images

- **URL**: `/images`
- **Method**: GET
- **Response**: List of images or HTML page (based on Accept header)

### Get Single Image

- **URL**: `/images/:id`
- **Method**: GET
- **Response**: Image file, JSON data, or HTML page (based on Accept header)

## Project Structure

```text
├── app.js                # Main application file
├── routes/              # Route files
│   ├── upload.js        # Upload handling
│   └── images.js        # Image retrieval
├── models/              # Data models
│   └── image.js         # Image model
├── public/              # Static files
│   └── images/          # Uploaded images
├── views/               # EJS views
│   ├── images.ejs       # Image list page
│   └── image.ejs        # Single image page
└── design/              # Frontend design files
```

## License

GNU General Public License v3.0

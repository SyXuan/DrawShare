I want to develop an web app. 該網頁app可以讓使用者畫圖並上傳到伺服器。

# Preivew

## Features section (optional)
It implements the following functions:
1. 使用者輸入名字
2. 畫布可以選擇顏色、清除
3. 使用者可以下載當前的畫布
4. 送出後上傳到伺服器顯示有沒有成功，沒成功就重試

## Required specifications
Now I need high-fidelity prototype designs. Please help me complete the prototype design for all interfaces using the following approach, ensuring these prototype interfaces can be used directly for development:
1. User experience analysis: First analyze the main functions and user needs of this app to determine the core interaction logic
2. Product interface planning: As a product manager, define key interfaces and ensure reasonable information architecture
3. High-fidelity UI design: As a UI designer, design interfaces that adhere to iOS/Android design standards, using modern UI elements to create a good visual experience
4. HTML prototype implementation: Use HTML+Tailwind CSS (or Bootstrap) to generate all prototype interfaces, and use FontAwesome (or other open-source UI components) to make the interface more beautiful and close to a real app design. Split code files to maintain a clear structure:
5. Each interface should be stored as a separate HTML file, such as home.html, draw.html, etc.
 - index.html serves as the main entry point, not directly containing HTML code for all interfaces, but embedding these HTML fragments using iframes, and displaying all pages directly in the index page without link redirections.
 - Realism enhancement:
    - Interface size should simulate iPhone 15 Pro, with rounded corners to make it look more like a real mobile interface.
    - Use real UI images rather than placeholder images (can be selected from Unsplash, Pexels, Apple official UI resources).
    - Add a top status bar (simulating iOS status bar) and include an app navigation bar (similar to iOS bottom TabBar).
    
Please follow the above requirements to generate complete HTML code in the design folder, ensuring it can be used for actual development.

# Backend

## Tech Stack
- Node.js
- Express.js
- SQLite

## API
- POST /upload: Uploads the image to the server
  - Request body:
    - image: The image file
    - name: User's name
  - Response body:
    - success: Whether the upload was successful
    - imageId: The ID of the uploaded image
    - message: A message describing the result of the upload
- GET /images: Returns a list of all images in the database
- GET /images/:id: Returns the image with the given id

## Database
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- name: TEXT
- image_file_name: TEXT
- uploaded_at: DATETIME DEFAULT CURRENT_TIMESTAMP

## File Structure
- app.js: The main application file
- routes/: Contains the route files
  - upload.js: Handles the upload route
  - images.js: Handles the images route
- models/: Contains the model files
  - image.js: Defines the Image model
- public/: Contains the public files
  - images/: Contains the uploaded images. File name's format is id_[YYYYMMDDHHMMSS]_username.png
- views/: Contains the view files
  - upload.ejs:
  - images.ejs:

 TaskmasterApp  

TaskmasterApp is a fullstack task management system designed to help users organize, prioritize, and manage tasks effectively. This application provides user registration, authentication, and task management features, enabling users to create, update, filter, and delete tasks seamlessly.



 Features  

 Authentication  
 Secure user registration and login with JWTbased authentication.  
 Password hashing using `bcrypt` for enhanced security.  

 Task Management  
 Create, update, and delete tasks.  
 Add attributes to tasks such as:
   Title
   Description
   Priority (Low, Medium, High)
   Deadline  

 Filtering and Searching  
 Filter tasks by priority or due date.  
 Search tasks based on keywords in the title or description.  

 API Design  
 RESTful API for managing tasks and users.  
 CRUD operations integrated with MongoDB.  

 Frontend  
 Userfriendly interface with responsive design.  
 Dynamic task management powered by asynchronous API calls using Fetch API.  



 Tech Stack  

 Backend  
 Node.js  
 Express.js  
 MongoDB  

 Frontend  
 HTML  
 CSS  
 JavaScript  

 Other Tools and Libraries  
 `jsonwebtoken` (JWT for authentication)  
 `bcrypt` (password hashing)  
 `nodemailer` (email notifications)  
 `mongoose` (MongoDB object modeling)  



 Setup and Installation  

1. Clone the repository:
   ```bash
   git clone https://github.com/bigimann/TaskmasterApp.git
   cd TaskmasterApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   MONGO_URI=your_mongodb_connection_string
   MAILTRAP_USER=your_mailtrap_username
   MAILTRAP_PASS=your_mailtrap_password
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the application:
   Open your browser and navigate to `http://localhost:3000`.



 Testing  

Run tests to ensure all functionalities work as expected:
```bash
npm test
```



 Deployment  

 Backend
The backend API is deployed on [Fly.io](https://fly.io/).  

 Frontend  
The frontend is hosted on [Netlify](https://netlify.com/) or [Vercel](https://vercel.com/).  



 API Endpoints  

 Authentication  
 `POST /register`  Register a new user.  
 `POST /login`  Login an existing user.  

 Tasks  
 `POST /tasks`  Create a new task.  
 `GET /tasks`  Get all tasks.  
 `GET /tasks/:id`  Get a specific task by ID.  
 `PUT /tasks/:id`  Update a task.  
 `DELETE /tasks/:id`  Delete a task.  



 Future Improvements  
 Add user profile management.  
 Implement notifications for task deadlines.  
 Add analytics for task performance tracking.  
 Expand the filtering system to include additional criteria.



 Contributing  
Contributions are welcome! Follow these steps:  
1. Fork the repository.  
2. Create a new branch (`git checkout b featurename`).  
3. Commit your changes (`git commit m 'Add feature'`).  
4. Push to the branch (`git push origin featurename`).  
5. Open a pull request.  



 License  

This project is licensed under the MIT License.  



 Contact  

For questions or feedback, feel free to contact the repository owner:  
 Name: Eneojo God’swill Ochimana  
 Email: eneojogodswill@gmail.com  
 GitHub: bigimann (https://github.com/bigimann)  


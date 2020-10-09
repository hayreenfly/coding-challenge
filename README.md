# challenge

node-coding-question

Req1:

1.

- Initialized Node Project with npm init and installed all dependencies using node package manager.
- Created an express server and utilized the following middlewares: body-parser for parsing incoming request bodies and added morgan as a logger of HTTP requests in the console for easy debugging.
- Set up postgres and created a test_db database.
- Used .sequelizerc to override default path to migration, models, seeders and config folder for better organization of files.
- Utilized sequelize-cli for migrations and project bootstrapping.

2.

- Created user model with the attributes required.
- Added a beforeCreate hook with bcrypt to hash password in the database before insertion.
- Connected database with the server.
- Created a users api route to implement user registration.
- Upon registration, IF email entered already exists, a json error response will be sent to notify user that "The email address is already being used". ELSE the user will be created and a valid jwt token that was generated will be assigned and attached to the headers.
- JWT secret configured and inputted in a .env file.
- JWT payload to return id and name.
- Set up jwt token to expire in 1hr.

3.

- Added express-validator middleware to check and handle validation errors.
- Created a custom middleware for authentication that implements jwt. In which if checks for valid token in the headers. IF not exists in headers, private routes will not be accessible.
- On Auth route (auth.js) created login capabilities using email and password for authentication.
  - Used sequelize to query database to match entered email and password. Unhashed password with bcyrpt compare.
  - IF, credentials checks out with information from database. jwt will be signed with secret and return a token (with payload: id and name). ELSE return an error to let user know that the credentials entered are invalid.

4.

- Created post model with the attributes required.
- Created post route for Post. Passed auth middleware to check if user is still authenticated to protect route.
  -IF still authenticated, find validation errors in the request. IF no errors found, insert data using sequelize and return
  created post.

![Register User](https://github.com/hayreenfly/coding-challenge/blob/master/SCREENSHOTS-FOR-API-CALLS/POST-register-user.png?raw=true)
![Login User](https://github.com/hayreenfly/coding-challenge/blob/master/SCREENSHOTS-FOR-API-CALLS/POST-login-user.png?raw=true)
![Get User Details](https://github.com/hayreenfly/coding-challenge/blob/master/SCREENSHOTS-FOR-API-CALLS/GET-get-user-details.png?raw=true)
![Create a Post](https://github.com/hayreenfly/coding-challenge/blob/master/SCREENSHOTS-FOR-API-CALLS/POST-create-post.png?raw=true)

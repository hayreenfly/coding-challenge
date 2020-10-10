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

Req2:

1.

- Created a post route in which a user can create a new post with the attributes Title, Description, Photo.

2.

- In the GET route for api/post/:userId queried the database using sequelize to return all posts from user.
  - Used moment library to calculate the time difference from when the post was created and now.
  - Created a post object with all the elements and push the data in foundPosts array and send the json response with the found posts.

3.

- Created an S3 Bucket with AWS. Saved credentials on a dot env file. Implemented multer and aws to upload images to aws S3. 
- Modified Posts model to make string size to 400 characters so all photo url will be saved in database as one string. (The photoURL will be sent to front end as an array as I am splitting the string to be returned as an array).
- Set up multer in which you cannot upload more than 5 photos.
- Created POST route for Post to view all posts created.

4.
- Created a PATCH route for post where user(author) of post will be able to edit title and description of post.

![Get All Posts by User](https://github.com/hayreenfly/coding-challenge/blob/req2/SCREENSHOTS-FOR-API-CALLS/GET-all-posts-by-userId.png?raw=true)
![Create a Post with multiple photos](https://github.com/hayreenfly/coding-challenge/blob/req2/SCREENSHOTS-FOR-API-CALLS/POST-post-with-multiple-photos.png?raw=true)
![Get an Error if More Than 5 Photos](https://github.com/hayreenfly/coding-challenge/blob/req2/SCREENSHOTS-FOR-API-CALLS/POST-post-error-more-than-5.png?raw=true)
![Edith a post](https://github.com/hayreenfly/coding-challenge/blob/req2/SCREENSHOTS-FOR-API-CALLS/POST-edit-post.png?raw=true)


Req3:

1.

- Created a new model schema for comments. associated with posts.
- Created a GET route for api/user/:postId/comments to view all comments with postId

2.
- Created a GET route for api/user to view all comments. with Pagination. Queried database to show all comments.
  - Implemented pagination using req.query (http://localhost:3000/api/post?page=2&limit=3) where you specify page and limit and do an arr.slice(startIndex, endIndex).
  - Impleted pagination as well with post comments.

3.
- Updated user model with migrations to add column username.
- Created PATCH route on api/users to create/update users username. Used sequelize to update database.

![Get All Posts with pagination](https://github.com/hayreenfly/coding-challenge/blob/req3/SCREENSHOTS-FOR-API-CALLS/GET-all-comments-pagination.png?raw=true)
![Get all Comments with pagination](https://github.com/hayreenfly/coding-challenge/blob/req3/SCREENSHOTS-FOR-API-CALLS/GET-all-comments-pagination.png?raw=true)
![POST a comment](https://github.com/hayreenfly/coding-challenge/blob/req3/SCREENSHOTS-FOR-API-CALLS/POST-comment-post.png?raw=true)
![Update username](https://github.com/hayreenfly/coding-challenge/blob/req3/SCREENSHOTS-FOR-API-CALLS/UPDATE-username.png?raw=true)

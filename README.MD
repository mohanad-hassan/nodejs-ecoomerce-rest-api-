##  to work you nedd to push these to .env file in the root 
MONGO_URL=
JWT_SECRET =   
JWT_LIFETIME  = 




## Hosted Project

[E-Commerce API Heroku URL](https://e-commerce-api-10.herokuapp.com/)

#### Setup Basic Express Server

- [done] import express and assign to variable
- [done] setup start port variable (5000) and start function

#### Connect To DB

- [done] get connection string
- [done] setup .env with MONGO_URL variable and assign the value
- [done] import 'dotenv' and setup package
- [done] import connect() and invoke in the starter
- [done] restart the server
- [done] mongoose V6 info

#### Basic Routes and Middleware

- [done] setup / GET Route
- [done] setup express.json() middleware
- [done] setup 404 and errorHandler middleware
- [done] import 'exress-async-errors' package

#### 404 vs ErrorHandler Middleware

#### Morgan Pacakge

- [Morgan Package](https://www.npmjs.com/package/morgan)

#### User Model

- [done] create models folder and User.js file
- [done] create schema with name,email, password (all type:String)
- [done] export mongoose model

#### Validator Package

- [Validator](https://www.npmjs.com/package/validator)

#### Auth Routes Structure

- [done] create controllers folder
- [done] add authController file
- [done] export (register,login,logout) functions
- [done] res.send('some string value')
- [done] create routes folder
- [done] setup authRoutes file
- [done] import all controllers
- [done] setup three routes
- [done] post('/register') post('/login') get('/logout')
- [done] import authRoutes as authRouter in the app.js
- [done] setup app.use('/api/v1/auth', authRouter)

#### Test Routes in Postman
- postman environment is a environments to set difference variables to every environments
#### Register Controller

- [done] create user
- [done] send response with entire user (only while testing)
- [done] check if email already in use (schema and controller), once is enough
- [done] ignore 'role'  , role means that who signed up is it a user or a admin.
- [done] alternative 'admin' setup

#### Handle Password

- [done] UserSchema.pre('save') - hook //this hook is from mongoose it execute a function before send the document to mongodb .
- this points to User
- bcrypt.genSalt - number of rounds  // we use this library for hashing passwords  before send them to  database .
- bcrypt.hash

#### JWT

- [done] require 'jsonwebtoken' package
- [done] create jwt - jwt.sign(payload,secret,options)
- [done] verify jwt - jwt.verify(token,secret)
- [done] add variables in .env JWT_SECRET=jwtSecret and JWT_LIFETIME=1d
- [done] restart the server !!!!
- [done] refactor code, create jwt functions in utils
- to see the incoming cookies you need npm package cookie parers .
- the cookie you set with res.cookies , when the client set a request you will find it in req.cookies.
- you can set paths for the cookies .
- [done] refactor cookie code
- [done] setup func attachCookiesToResponse
- cookies SECURE:TRUE means that it uses https mode and not http (in development you have to use http) .
- cookies SIGNED:TRUE it signature to see if the front end manipulate the cookie  , you have to set a password in cookies parser(secret) .
- [done] accept payload(res, tokenUser)
- [done] create token, setup cookie
- [done] optionally send back the response

#### Login Route

- [done] check if email and password exist, if one missing return 400
- [done] find user, if no user return 401
- [done] check password, if does not match return 401
- [done] if everything is correct, attach cookie
  and send back the same response as in register

#### Logout Route
- cookies is object and every cookie have a unique key name ,and you can manipulate them manually .
- when the cookies expires its automatically deleted .
- on of these two is enough .
- [done] set token cookie equal to some string value
- [done] set expires:new Date(Date.now())

#### User Routes Structure

- [done] add userController file
- [done] export (getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword) functions
- [done] res.send('some string value')
- [done] setup userRoutes file
- [done] import all controllers
- [done] setup just one route - router.route('/').get(getAllUsers);
- [done] import userRoutes as userRouter in the app.js
- [done] setup app.use('/api/v1/users', userRouter)

#### GetAllUsers and GetSingleUser

- [done] Get all users where role is 'user' and remove password
- [done] Get Single User where id matches id param and remove password
- [done] If no user 404

#### Authenticate User Setup
done
#### Auth User Complete
done
#### Authorize Permissions Setup

- [done] hardcode

#### Authorize Permissions Complete

- [done] introduce params

#### ShowCurrentUser

- [done] get user from req
- [done] send response with user

#### UpdateUserPassword

- [done] almost identical to login user
- [done] add authenticateUser middleware in the route
- [done] check for oldPassword and newPassword in the body
- [done] if one missing 400
- [done] look for user with req.user.userId
- [done] check if oldPassword matches with user.comparePassword
- [done] if no match 401
- [done] if everything good set user.password equal to newPassword
- [done] await user.save()

#### createTokenUser in Utils

- [done] create a file in utils (createTokenUser)
- [done] setup a function that accepts user object and returns userToken object
- [done] export as default
- [done] setup all the correct imports/exports and refactor existing code

#### updateUser with User.findOneAndUpdate()

- [done] add authenticateUser middleware in the route
- [done] check for name and email in the body
- [done] if one is missing, send 400 (optional)
- [done] use findOneAndUpdate()
- [done] create token user, attachCookiesToResponse and send back the tokenUser

#### updateUser with user.save()
the differnce betwwen save() and findAndUpdate is save() triggers the save Hooks in Mongoose 
#### Setup and Apply checkPermissions()
 to prevent users from see other users profiles if they have the id of that user .
#### Product Model

- [done] create Product.js in models folder
- [done] create Schema
- [done] name : {type:String}
- [done] price: {type:Number}
- [done] description: {type:String}
- [done] image: {type:String}
- [done] category: {type:String}
- [done] company: {type:String}
- [done] colors: {type:[]}
- [done] featured: {type:Boolean}
- [done] freeShipping: {type:Boolean}
- [done] inventory:{type:Number}
- [done] averageRating:{type:Number}
- [done] user
- [done] set timestamps
- [done] export Product model

#### Product Structure

- [done] add productController file in controllers
- [done] export (createProduct, getAllProducts,
  getSingleProduct, updateProduct, deleteProduct, uploadImage) functions
- [done] res.send('function name')
- [done] setup productRoutes file in routes
- [done] import all controllers
- [done] only getAllProducts and getSingleProduct accessible to public
- [done] rest only by admin (setup middleware)
- [done] typical setup
- [done] router.route('/uploadImage').post(uploadImage)
- [done] import productRoutes as productRouter in the app.js
- [done] setup app.use('/api/v1/products', productRouter)

#### Product Routes in Postman

#### Create Product

- [done] pass req.body into Product.create
- [done] create user property on req.body and set it equal to userId (req.user)
- [done] send back the product

#### Remaining Controllers (apart from uploadImage)

- [done] getAllProducts
- [done] getSingleProduct
- [done] updateProduct
- [done] deleteProduct
- [done] typical CRUD, utilize (task or job) project
- [done] remember we check already for role 'admin'

#### Upload Image

- [done] if some question, re-watch 07-file-upload
- [done] images folder with two images

#### Review Model

- [done] create Review.js in models folder
- [done] create Schema
- [done] rating : {type:Number}
- [done] title: {type:String}
- [done] comment: {type:String}
- [done] user
- [done] product
- [done] set timestamps
- [done] export Review model

#### Review Structure

- [] add reviewController file in controllers
- [] export (createReview, getAllReviews, getSingleReview, updateReview, deleteReview) functions
- [] res.send('function name')
- [] setup reviewRoutes file in routes
- [] import all controllers
- [] only getAllReviews and getSingleReview accessible to public
- [] rest only to users (setup middleware)
- [] typical REST setup
- [] import reviewRoutes as reviewRouter in the app.js
- [] setup app.use('/api/v1/reviews', reviewRouter)

#### Create Review

- [] check for product in the req.body
- [] attach user property (set it equal to req.user.userId) on to req.body
- [] create review
- [] don't test yet

#### Get All Reviews and Get Single Review

- [] both public routes, typical setup

#### Delete Review

- [] get id from req.params
- [] check if review exists
- [] if no review, 404
- [] check permissions (req.user, review.user)
- [] use await review.remove()
- [] send back 200

#### Update Review

- [] get id from req.params
- [] get {rating, title comment} from req.body
- [] check if review exists
- [] if no review, 404
- [] check permissions
- [] set review properties equal to rating, title, comment
- [] use await review.save()
- [] send back 200

#### MONGO Populate
- mongo db function that get s the information's from document and push in the response of another doc .
- to use it you have to refer the document collection in the schema .
- 

#### Virtual

#### Get Single Product Reviews

#### Remove All Reviews
difference between remove() and findOneAndDelete is remove () triggers a hook pre "remove" 
so lets say we have a product that have a reviews associated to it  , its more sense to remove all the reviews that are associated to that product .

#### Aggregation Pipeline - Atlas and Code

#### Order Schema

- [] create Order.js in models folder
- [] create Schema
- [] tax : {type:Number}
- [] shippingFee: {type:Number}
- [] subtotal: {type:Number}
- [] total: {type:Number}
- [] orderItems:[]
- [] status:{type:String}
- [] user
- [] clientSecret:{type:String}
- [] paymentId:{type:String}
- [] set timestamps
- [] export Order model

#### Order Structure

- [] add orderController file in controllers
- [] export (getAllOrders, getSingleOrder, getCurrentUserOrders,
  createOrder, updateOrder) functions
- [] res.send('function name')
- [] setup orderRoutes file in routes
- [] import all controllers
- [] authenticate user in all routes
- [] getAllOrders admin only
- [] typical REST setup
- [] router.route('/showAllMyOrders').get(getCurrentUserOrders)
- [] import orderRoutes as orderRouter in the app.js
- [] setup app.use('/api/v1/orders', orderRouter)

#### Order in Postman

#### Create Order

- [] most complex

#### Get All Orders and Get Single Order

- [] getAllOrders - admin only
- [] getSingleOrder - chechPermissions

#### Get Current User Orders

- [] find orders where user is equal to req.user.userId

#### Update Order

- [] get order id
- [] get paymentIntentId (req.body)
- [] get order
- [] if does not exist - 404
- [] check permissions
- [] set paymentIntentId and status as 'paid'
- [] order.save()

#### Create Docs
to export postman to html page 
- [] [Docgen Library] (https://github.com/thedevsaddam/docgen)
- [] Export Postman Collection
- [] docgen build -i fileName.json -o index.html
- [] create index.html in public

#### Security Packages

- [] express-rate-limiter to limit the requests from same api 
- [] helmet
- [] xss-clean 
- [] express-mongo-sanitize
- [] cors (cookies!!!!) //to allow access from different domain 

#### Deploy on Heroku

- [] heroku account and heroku cli
- [] remove/copy from the main repo
- [] add dev command "nodemon app.js"
- [] change start to "node app.js"
- [] setup node version in package.json
- [] "engines": {"node": "14.x"}
- [] Procfile "web: node app.js"
- [] remove existing git repo
- [] rm -rf .git - mac,
- [] git init
- [] git add .
- [] git commit -m "initial commit"
- [] heroku login
- [] heroku create "App Name"
- [] git remote -v
- [] setup env vars in GUI
- [] git push heroku master/main

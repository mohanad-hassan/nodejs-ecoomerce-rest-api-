//the order is so important

//set the env file package 
require("dotenv").config()

// npm package to avoid try catch blocks every where and throw errors without next(err)
require("express-async-errors")

//npm package to parse cookies 
const cookieParser = require("cookie-parser")

//morgan is library to view the url you hit in the console log 
const morgan = require("morgan")

//library for uploading files 
const fileUploader  = require("express-fileupload")
//express
const express = require("express");
const app = express();

//connect db 
const connectDB = require("./db/connect")

//middlewares 
const notFound  = require("./middleware/not-found")
const errorHandler  = require("./middleware/error-handler")

//Routers 
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const productsRouter  = require("./routes/productsRoutes")
const reviewRouter  = require("./routes/reviewRoutes")
const orderRouter  = require("./routes/orderRoutes")
//to read json requests 
app.use(express.json()) //its so important without it express cant work with json 
//to parse cookies 
//we use a password for signed cookies  ({signed:true})
app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgan("tiny")) //to console log the url with every request .
app.use(express.static("./public"))
app.use(fileUploader())//library for uploading files , and understand the files comes from request object .

//security packages 
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());


//Routes
app.get("/",(req,res) => {
    console.log(1,req.cookies)
    res.send("HOME PAGE ") })

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/products",productsRouter)
app.use("/api/v1/reviews",reviewRouter)
app.use("/api/v1/orders",orderRouter)

//not found page and error handler 
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000;

const start = async () => {
    await connectDB(process.env.MONGO_URL)
    try {
    app.listen(port, () => {
        console.log(`server is listening on port ${port}`);
    });
    } catch (error) {
    console.log(error);
    };
} ;
start()

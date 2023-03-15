const Review = require("../models/Review")
const Product  = require("../models/Product")
const { StatusCodes } = require("http-status-codes")
const CustomApiError = require("../errors")
const {checkPermissions} = require("../utils")
const createReview = async(req, res) => {
    //get the userId
const {userId} = req.user
//get the product Id 
const productId  = req.body.product

//check if the product is in the database , if not found throw error 
const product  = await Product.findOne({_id:productId})
if(!product) {
    throw new CustomApiError.BadRequestError("please select a product to review ")
}
//set the user id on the request body 
req.body.user  = userId

//check if this user has already reviewed this product and if true prevent (we already do that in the Schema )
const isAlreadyReviewed  = await Review.findOne({product:productId,user:userId})
if (isAlreadyReviewed) {
    throw new CustomApiError.BadRequestError("you already reviewed this product ")
}

//review 
const review = await Review.create(req.body)
res.status(StatusCodes.CREATED).json(review)

}

const getAllReviews =async (req, res) => {
  //we use with populate function this way we can inter user information's and product information's inside the review response .
const reviews = await Review.find({}).populate ({path:"product",select:"name company price"}).populate({path:"user",select:"name",})
res.status(StatusCodes.OK).json({reviews,length:reviews.length})
}

const getSingleReview = async(req, res) => {
    const {id:reviewId} = req.params
      //we use with populate function this way we can inter user information's and product information's inside the review response .
    const review  = await Review.findOne({_id:reviewId}).populate ({path:"product",select:"name company price"}).populate({path:"user",select:"name",})
    if(!review) {
        throw new CustomApiError.NotFoundError(`no review with the id ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async(req, res) => {
    const user = req.user
const {id:reviewId} = req.params;
const review  = await Review.findOne({_id:reviewId})
if(!review) {
    throw new CustomApiError.NotFoundError(`the review with id ${reviewId} is not found `)
}
checkPermissions(user,review)
const {rating,comment,title} = req.body
if(!rating||!comment||!title) {
    throw new CustomApiError.BadRequestError("please provide comment title and rating")
}

review.comment  = comment
review.rating  = rating
review.title  = title
await review.save()

    res.status(StatusCodes.OK).send(review)}


const deleteReview = async(req, res) => {
    const user = req.user
const {id:reviewId} = req.params;
const review  = await Review.findOne({_id:reviewId})
if(!review) {
    throw new CustomApiError.NotFoundError(`the review with id ${reviewId} is not found `)
}
checkPermissions(user,review)
await review.remove();
res.status(StatusCodes.OK).send("success review removed ")
}

module.exports = { createReview, getAllReviews, getSingleReview, updateReview, deleteReview }
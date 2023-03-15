const express = require("express")
const router  = express.Router()
const { createReview, getAllReviews, getSingleReview, updateReview, deleteReview } =require("../controllers/reviewController")
const { authenticationMiddleWare, authorizationMiddleware } = require("../middleware/authentication")


router.route('/').get(getAllReviews).post(authenticationMiddleWare,createReview)

router.route('/:id').get(getSingleReview).patch(authenticationMiddleWare,updateReview).delete(authenticationMiddleWare,deleteReview)

module.exports = router
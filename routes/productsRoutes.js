const express = require('express');
const router = express.Router();
const { authenticationMiddleWare, authorizationMiddleware } = require("../middleware/authentication")
const{createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadImage,getSingleProductReviews} = require('../controllers/productController');


router
  .route('/')
  .post([authenticationMiddleWare, authorizationMiddleware('admin')], createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post([authenticationMiddleWare, authorizationMiddleware('admin')], uploadImage);

  router.route("/reviews/:id").get(getSingleProductReviews)


router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticationMiddleWare, authorizationMiddleware('admin')], updateProduct)
  .delete([authenticationMiddleWare, authorizationMiddleware('admin')], deleteProduct);



module.exports = router;

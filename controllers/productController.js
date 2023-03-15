const Product = require("../models/Product");
const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("../errors");
const path = require("path")
const createProduct = async (req, res) => {
    //set the user id to the body
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.send(product);
};

const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json(products);
};

const getSingleProduct = async(req, res) => {
    const {id:productId} = req.params
    //set to response the product with the reviews with populate method 
    const product  = await Product.find({_id:productId}).populate("reviews")
    if(!product) {
        throw new CustomApiError.NotFoundError(`the product  with id ${productId} is not found`);
    }
    res.status(StatusCodes.OK).json(product);
};

const updateProduct = (req, res) => {
    res.send("updateProduct");
};
const deleteProduct = async(req, res) => {
    const {id:productId} = req.params
    const product  = await Product.findOne({_id:productId})
    //remove will trigger a mongodb hooks that we will use to remove the reviews associated to this product 
   await product.remove()
    res.status(StatusCodes.OK).send("product deleted ");

};
const uploadImage =async  (req, res) => {
    if (!req.files) {
        throw new CustomApiError.BadRequestError('No File Uploaded');
      }
      const productImage = req.files.image;
    
      if (!productImage.mimetype.startsWith('image')) {
        throw new CustomApiError.BadRequestError('Please Upload Image');
      }
    
      const maxSize = 1024 * 1024;
    
      if (productImage.size > maxSize) {
        throw new CustomApiError.BadRequestError(
          'Please upload image smaller than 1MB'
        );
      }
    //store the image in the server pc 
      const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${productImage.name}`
      );
      //move the image from the req.files to our server  (this is nodejs model)
      await productImage.mv(imagePath);
      res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });};

      const getSingleProductReviews  = async(req,res) => { 
const {id:productId} = req.params
const reviews  = await Review.find({product:productId})

        res.status(StatusCodes.OK).json({reviews,count:reviews.length})
       }

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,getSingleProductReviews
};

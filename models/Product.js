const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide product name'],
            maxlength: [100, 'Name can not be more than 100 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            default: 0,
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            maxlength: [1000, 'Description can not be more than 1000 characters'],
        },
        image: {
            type: String,
            default: '/uploads/example.jpeg',
        },
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            enum: ['office', 'kitchen', 'bedroom'],
        },
        company: {
            type: String,
            required: [true, 'Please provide company'],
            enum: {
                values: ['ikea', 'liddy', 'marcos'],
                message: '{VALUE} is not supported',
            },
        },
        colors: {
            type: [String],
            default: ['#222'],
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            required: true,
            default: 15,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        //refernce to the owner of this project (id for the user that stored on mongodb )
        //we use with populate function this way we can inter user information's inside the product response 
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    //this set is for populate method because the reviews are not found when the product is created 
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//to get the reviews from the db 
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

//this is for removing all the reviews associated to this product
ProductSchema.pre('remove', async function (next) {
    //we will access to the review Model
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, "Please provide rating"],
        },
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide review title"],
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, "Please provide review text"],
        },
        //we use with populate function this way we can inter user information's inside the product response
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        //we use with populate function this way we can inter user information's inside the product response
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true }
);

//this method will execute with every operation on the schema 
ReviewSchema.statics.calculateAverageRating = async function (productId) {
    //calculate the average of the reviews rating 
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        //push the values we got to the project 
        await this.model("Product").findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
            }
        );
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post("save", async function () {
    await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
    await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);

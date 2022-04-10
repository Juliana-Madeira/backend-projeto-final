const { Router } = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');

const router = Router();

//creat review
router.post('/review/:productId', async(req, res) => {
    const { productId } = req.params;
    const { id } = req.user;
    const { review } = req.body;
    
    try {
        const reviewC = { review, productId, userId: id };
        
        const reviewCreated = await Review.create(reviewC);
            
        await Product.findByIdAndUpdate(productId, { $push: { reviews: reviewCreated._id }}, { new: true });
        res.status(201).json(reviewCreated);
    } catch (error) {
        res.status(500).json({ message: 'Error trying to create review', error });
    }
});


//update review
router.put('/review/:reviewId', async (req, res) => {
    const { id } = req.user;
    const { reviewId } = req.params

    try {
        const review = await Review.findOneAndUpdate({ _id: reviewId, userId: id }, req.body, { new: true });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error trying to update a review', error});
    }
});


//delete one review
router.delete('/review/:reviewId', async(req, res) => {
    const { reviewId } = req.params;
    const { id } = req.user;
    try {
        const review = await Review.findById({ _id: reviewId});
        if (review.userId != id) {
            res.status(400).json("User can't delete other user's reviews");
        }
        await Review.findOneAndDelete({ _id: reviewId, userId: id });
        
        await Product.findByIdAndUpdate(review.productId, { $pull: {reviews: reviewId }});
        res.status(200).json({ message:'review deleted'});

    } catch (error) {
        res.status(500).json({ message: 'Error trying to delete a review'});
    }
});


module.exports = router;
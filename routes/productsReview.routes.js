const { Router } = require('express');
const Review = require('../models/Review');

const router = Router();

//get all reviews of one product
router.get('/:productId', async(req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({productId}).populate('userId', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error trying to get reviews', error });
    }
});

module.exports = router;
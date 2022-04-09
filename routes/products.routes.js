const { Router } = require('express');
const Product = require('../models/Product');
const { authorization, 
    tokenAndAuthorization, 
    tokenAndAdmin} = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json(allProducts);

    } catch (error) {
        res.status(500).json({message: "Could not get all products", error});
    }
});

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({message: "Product not found", error});
    }
});

router.post('/', tokenAndAdmin, async (req, res) => {
    try {
    //     const newProduct = await Product.create({...req.body, productId: id});
    //     res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({message: "Could not create a new product", error});
    }
});

router.put('/:productId', tokenAndAdmin, async (req, res) => {
    const { productId } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
        productId, 
        {new: true}
        )
        res.status(updatedProduct);

    } catch (error) {
        res.status(500).json({message: "Could not update this product", error});
    }
});

router.delete('/:productId', tokenAndAdmin, async (req, res) => {
    const { productId } = req.params;
    try {
        await Product.findByIdAndDelete(productId);
        res.status(204).json('Product deleted!')
    } catch (error) {
        res.status(500).json({message: "Could not delete this product", error});
    }
});

module.exports = router;
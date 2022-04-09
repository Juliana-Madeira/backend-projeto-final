const { Router } = require('express');
const Order = require('../models/Order');
const Cart = require ('../models/Cart')

const router = Router();

// Get all Orders
router.get('/order', async(req,res) => {
    const{ id } = req.user;

    try{
        const order = await Order.findOne({userId: id}).populate({path:'products', populate: { path: 'productId'}})
        res.status(200).json(order);
    } catch(err){
        res.status(500).json(err);
    }
})


//Create
router.post("/order/:productId", async(req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId= req.user.id;
   try{
       const order = await Order.findById( userId );
    if(!order) {
        const newOrder = await Order.create( userId );
        const payload = {
            productId,
            orderId: newOrder._id,
            quantity,
        }
        const createCart = await Cart.create(payload);
        const updateCart = await Order.findByIdAndUpdate(newOrder._id, {$push: {products: createCart._id}},{new: true})
        res.status(201).json(updateCart);
    } else {
        const product = await Cart.findById(productId);
        if(product){
            const newQuantity = product.quantity + 1;
            const updateProducts = await Cart.findByIdAndUpdate(product._id, {quantity: newQuantity});
            res.status(200).json();
        } else {
            const payload ={
                productId,
                orderId: newOrder._id,
                quantity
            }
            const createProductinCart = await Cart.create(payload);
            const updateProductinCart = await Order.findByIdAndUpdate( order._id, {$push: {products : createProductinCart._id}},{new: true})
            res.status(201).json(updateProductinCart)
        }

    }
   } catch(err){
    res.status(500).json(err);
   }
})

//EDITAR < - PARAMOS AQUI

//Carrinho do usuário
router.get('/:cartId', async(req,res) =>{
    const {cartId} = req.params;
    try{
        const cartList = await Order.findById(cartId)
        res.status(200).json( cartList);
    }catch (err){
        res.status(500).json({ error: error.message });  
    }
})

//Update
router.put('/:cartId', async(req, res) => {
    const {cartId} = req.params;
    const payload = req.body;
    const userId = req.user.id;
    try{
        const updatedCart = await Order.findByIdAndUpdate({_id: cartId, user: userId}, payload ,{new: true})
        if(!updatedCart){
            throw new Error('Cannot update cart from another user')
        }
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: error.message });  
    }
})

//Delete
router.delete('/:cartId', async(req, res) => {
    const {cartId} = req.params;
    const userId = req.user.id;
    try{
        const deleteCart = await Order.delete(cartId);
        if (deleteCart.user.toString() !== userId){
            throw new Error('cannot delete another user cart')
        }
        deleteCart.delete()
        res.status(204).json();

    } catch (err) {
        res.status(500).json({ error: error.message }); 
    }
})


module.exports = router;
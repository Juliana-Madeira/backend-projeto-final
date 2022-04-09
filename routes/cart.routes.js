const { Router } = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
//const auth = require('./auth.routes');

const router = Router();

//Create
router.post("/", async(req, res) => {
    const newCart = new Order(req.body);
    const userId= req.user.id
    try{
        const createCart = {...newCart, user: userId}
        const cart = await Cart.creat(createCart);
        await User.findByIdAndUpdate( userId, {$push: {cartId: cart._id}})
        res.status(200).json(savedCart);
    } catch (err){
        res.status(500).json(err);
    }
})

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
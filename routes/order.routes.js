const { Router } = require('express');
const Order = require('../models/Order');
const Cart = require ('../models/Cart')

const router = Router();

// Get all Orders
router.get('/order', async(req,res) => {
    const{ id } = req.user;

    try{
        const order = await Order.findOne({userId: id}).populate({path:'products', populate: { path: 'productId'}})
        res.status(200).json({order});
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
            res.status(201).json({updateProductinCart})
        }

    }
   } catch(err){
    res.status(500).json(err);
   }
})

//EDITAR < - PARAMOS AQUI

router.put('/order/:productId', async(req, res) => {
    const {orderId} = req.params;
    const payload = req.body;
    const userId = req.user.id;
    try{
        const order = await Order.find(userId)
        const updatedOrder = await Order.findByIdAndUpdate({_id: orderId, user: userId}, payload ,{new: true})
        if(!updatedOrder){
            throw new Error('Cannot update the Order from another user')
        }
        res.status(200).json({updatedOrder});
    } catch (err) {
        res.status(500).json({ error: error.message });  
    }
})

//Alterar Status do Order Fechado
router.put('/order-fechado', async (req, res) => {
    const { id } = req.user;
    try {
        const order = await Order.findOneAndUpdate({ user_id: id}, { status: 'fechado' }, { new: true });
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Order Status Pago
router.put('/order-pago', async (req, res) => {
    const { id } = req.user;
    try {
        const order = await Order.findOneAndUpdate({ user_id: id}, { status: 'pago' }, { new: true });
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json(error);
    }
});

//deletar um produto do Order
router.delete('/order/:productId', async (req, res) => {
    const { productId } = req.params;
    const { id } = req.user

    try {
        
        const order = await Order.findOne({ user_id: id });
        const productOrder = await Cart.findOne({ cartId: order._id, productId });
        await Order.findByIdAndUpdate(order._id, { $pull: { products:  productOrder._id }  }, { new: true } );

        await Cart.findOneAndDelete({ cartId: order._id, productId });
        res.status(200).json();
    } catch(error) {
        res.status(500).json({ message: 'Error deleting product in the Order', error});
    }
});


//limpar Cart(remover todos os produtos)
router.delete('/clean-order', async (req, res) => {
    const { userId } = req.user;
    
    try {
        const order = await Order.findOne({ userId });
        //deletar todos do Cart
        await Cart.deleteMany({ cartId: order._id });

        //deletar dentro de Cart
        await Cart.findByIdAndUpdate(order._id, { $set: { products: [] }});
        res.status(200).json();
    } catch (error) {
        res.status(500).json(error);
    }
});

//remover entire Order
router.delete('/order-delete', async(req, res) => {
    const { id } = req.user;

    try {
        await Cart.deleteMany({ userId: id });

        await Order.findOneAndDelete({ userId: id });
        res.status(200).json({ message: 'Order succesfully deleted' });    
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;
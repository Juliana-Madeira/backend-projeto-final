const { Router } = require("express");
const Cart = require("../models/Cart");
const CartProduct = require("../models/CartProduct");

const router = Router();

//get Cart
router.get('/cart-product', async (req, res) => {
    const { id } = req.user;
     try {
        const userCart = await Cart.findOne({userId: id});
        const cart = await CartProduct.find({ cartId: userCart._id }).populate('productId');
        res.status(200).json(cart);
     } catch (error) {
         res.status(500).json({message: `You don't have any cart`, error});
     }
});


//get one Product do user logado
router.get('/cart-product/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await CartProduct.find({ productId }).populate('productId');
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: `You don't have any cart`, error})
    }
});


//deletar todos os productos do cart
router.delete('/all', async (req, res) => {
    const { id } = req.user;

    try {
        //pegar o Order id
        const cart = await Cart.findOne({ userId: id });
        //para deletar
        await CartProduct.deleteMany({ cartId: cart._id});

        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all products in Cart', error});
    }
});

// add products in the cart
router.post('/add-product/:productId', async(req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  console.log(productId, userId)
  try{
  const cart = await Cart.findOne({ userId, status:"opened" });
  const cartId = cart._id
  console.log(cart, cartId)
  const productInCart = await CartProduct.findOne({productId, cartId});
  console.log(productInCart)
  if (productInCart) {
    const newQuantity = productInCart.quantity + 1;
    const updateProducts = await CartProduct.findByIdAndUpdate(
      productInCart._id,
      { quantity: newQuantity }
    );
    res.status(200).json({ message: "Quantity updated." });
  } else {
    const payload = {
      productId,
      quantity,
      cartId
    };
    const createProductinCart = await CartProduct.create(payload);
    const updateProductinCart = await Cart.findByIdAndUpdate(
      cart._id,
      { $push: { products: createProductinCart._id } },
      { new: true }
    );
    res.status(201).json(updateProductinCart);
  }

} catch (error) {
res
  .status(500)
  .json({
    message: `Could not add products in the cart, please try again!`,
    error: error.message,
  })}
})
  


// add quantity of the product in the cart
router.put("/add-quantity-of-product/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  console.log(productId, userId)
  try {
    const cart = await Cart.findOne({ userId, status:"opened" });
    const cartId = cart._id;
    if (!cart){
      return res.status(404).json({ message: "Cart not found", error }); 
    } 
    const productInCart = await CartProduct.findOne({cartId});
    console.log(productInCart)
    const newQuantity = productInCart.quantity + 1;
    const cartUpdate = await CartProduct.findOneAndUpdate(
      { productId },
      { quantity: newQuantity },
      { new: true }
    );
    res.status(200).json({ cartUpdate });
    
  } catch (error) {
    res.status(500).json({ message: `Could not update the quantity of the product`, error: error.message });
  }
});

// take out quantity of the product in the cart
router.put("/take-out-quantity-of-product/:productId", async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.user;
  try {
    const cart = await Cart.findOne({ userId, status:"opened" });
    if (!cart){
      return res.status(404).json({ message: "Cart not found", error }); 
    } 
      const newQuantity = productInCart.quantity - 1;
    const cartUpdate = await CartProduct.findOneAndUpdate(
      { productId },
      { quantity: newQuantity },
      { new: true }
    );
    res.status(200).json({ cartUpdate });
    
  } catch (error) {
    res.status(500).json({ message: `Could not update the quantity of the product`, error });
  }
});

module.exports = router;

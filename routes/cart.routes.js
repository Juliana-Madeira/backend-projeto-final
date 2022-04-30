const { Router } = require("express");
const Cart = require("../models/Cart");
const CartProduct = require("../models/CartProduct");

const router = Router();

//get all - pegar todos os carrinhos do usuário
//rota ok
router.get("/", async (req, res) => {
  const { id } = req.user;

  try {
    const cart = await Cart.findOne({ userId: id }).populate({
      path: "products",
      populate: { path: "productId" },
    });
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: `Sorry! You don't have any carts`, error });
  }
});

//Post Create - Criar um carrinho novo - verificando se ja tem um aberto
//rota ok
router.post("/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    console.log("oi!");

    if (!cart) {
      
      const newCart = await Cart.create({ userId });
      

      const payload = {
        productId,
        cartId: newCart._id,
      };

      const createCart = await CartProduct.create(payload);

      const updateCart = await Cart.findByIdAndUpdate(
        newCart._id,
        { $push: { products: createCart._id } },
        { new: true }
      );
      res.status(201).json(updateCart);
    } else {
      console.log('estou aqui 1 else')
      const productInCart = await CartProduct.findOne({productId, cartId:cart._id});
      if (productInCart) {
        const newQuantity = productInCart.quantity + 1;
        const updateProducts = await CartProduct.findByIdAndUpdate(
          productInCart._id,
          { quantity: newQuantity }
        );
        res.status(200).json({ message: "Quantity updated." });
      } else {
        console.log('estou aqui 2 else')
        const payload = {
          productId,
          cartId: cart._id
        };
        const createProductinCart = await CartProduct.create(payload);
        const updateProductinCart = await Cart.findByIdAndUpdate(
          cart._id,
          { $push: { products: createProductinCart._id } },
          { new: true }
        );
        res.status(201).json(updateProductinCart);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Could not create the cart, please try again!`,
        error: error.message,
      });
  }
});

//update - atualizar o carrinho
//rota ok
router.put("/update/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const payload = req.body;
  const userId = req.user.id;
  
  try {
    const cart = await Cart.find({ userId });
    if(!cart){
      return res.status(404).json({ message: "Cart not found", error }); 
    }
    
    
    const updatedCart = await Cart.findByIdAndUpdate(
      { _id: cartId, user: userId },
      payload,
      { new: true }
    );
    if (!updatedCart) {
      throw new Error("Cannot update the cart from another user");
    }

    res.status(200).json({ updatedCart });
  } catch (error) {
    res.status(500).json({ message: `Update failed`, error });
  }
});



//Alterar Status do Order Fechado
//rota ok
router.put("/placed-order", async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: id, status:"opened" },
      { status: "placed" },
      { new: true }
    );
    res.status(200).json({ cart });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Could not update to placed order`,
        error: error.message,
      });
  }
});

//Order Status Pago
//rota ok
router.put("/paid-order", async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.findOneAndUpdate(
      { user_id: id, status: "placed" },
      { status: "paid" },
      { new: true }
    );
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: `Could not update to paid order`, error });
  }
});

//deletar um produto do cart 
router.delete("/remove/:productId", async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;
  

  console.log(productId, id);

  try {
    const cart = await Cart.findOne({ userId: id });
    console.log(cart._id);
    const productCart = await CartProduct.findOne({
      cartId: cart._id,
      productId,
    });
    console.log(productCart);
    await Cart.findByIdAndUpdate(
      cart._id,
      { $pull: { products: productCart._id } },
      { new: true }
    );

    await CartProduct.findOneAndDelete({ cartId: cart._id, productId });
    res.status(200).json();
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting product in the Cart",
        error: error.message,
      });
  }
});

//limpar Cart(remover todos os produtos)
router.delete("/clean-cart/:cartId", async (req, res) => {
  const {cartId} = req.params;
  const { id } = req.user;

  try {
    const cart = await Cart.findOne({ userId: id, status: "opened"});
    console.log(cart)
    // //deletar todos do CartProduct
    await CartProduct.deleteMany({cartId});

    //deletar dentro de Cart
    await Cart.findByIdAndUpdate(cart._id, { $set: { products: [] } });
    res.status(200).json();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Could not delete the products in the cart`, error });
  }
});

//remover entire Cart
//rota ok
router.delete("/delete-cart/:cartId", async (req, res) => {
  const {cartId} = req.params;


  try {
    await CartProduct.deleteMany({ cartId });

    await Cart.findByIdAndDelete( cartId );
    res.status(200).json({ message: "Cart succesfully deleted" });
  } catch (error) {
    res.status(500).json({ message: `Could not delete the order`, error });
  }
});

module.exports = router;

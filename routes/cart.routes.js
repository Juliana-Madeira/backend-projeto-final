const { Router } = require("express");
const Cart = require("../models/Cart");
const CartProduct = require("../models/CartProduct");

const router = Router();

// Get all Orders
router.get("/", async (req, res) => {
  const { id } = req.user;

  try {
    const cart = await Cart.findOne({ userId: id }).populate({
      path: "products",
      populate: { path: "productId" },
    });
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: `Sorry! You don't have orders`, error });
  }
});

//Create
router.post("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    console.log("oi");

    if (!cart) {
      const newCart = await Cart.create({ userId });

      const payload = {
        productId,
        cartId: newCart._id,
        quantity,
      };

      const createCart = await CartProduct.create(payload);

      const updateCart = await Cart.findByIdAndUpdate(
        newCart._id,
        { $push: { products: createCart._id } },
        { new: true }
      );
      res.status(201).json(updateCart);
    } else {
      const productInCart = await CartProduct.findOne({productId, cartId:cart._id});
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
          cartId: newCart._id,
          quantity,
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
        message: `Could not create the order, please try again!`,
        error: error.message,
      });
  }
});

router.put("/:orderId", async (req, res) => {
  const { cartId } = req.params;
  const payload = req.body;
  const userId = req.user.id;
  try {
    const cart = await Cart.find({ userId });
    const updatedCart = await Cart.findByIdAndUpdate(
      { _id: cartId, user: userId },
      payload,
      { new: true }
    );
    if (!updatedCart) {
      throw new Error("Cannot update the order from another user");
    }
    res.status(200).json({ updatedCart });
  } catch (error) {
    res.status(500).json({ message: `Update failed 00`, error });
  }
});

//Alterar Status do Order Fechado (Rota não está funcionando)
router.put("/placed-order", async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: id },
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

//Order Status Pago (Rota não está funcionando)
router.put("/paid-order", async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.findOneAndUpdate(
      { user_id: id },
      { status: "paid" },
      { new: true }
    );
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: `Could not update to paid order`, error });
  }
});

//deletar um produto do cart
router.delete("/:productId", async (req, res) => {
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
        message: "Error deleting product in the Order",
        error: error.message,
      });
  }
});

//limpar Cart(remover todos os produtos)
router.delete("/clean-cart", async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = await Cart.findOne({ userId });
    //deletar todos do Cart
    await CartProduct.deleteMany({ cartId: cart._id });

    //deletar dentro de Cart
    await CartProduct.findByIdAndUpdate(cart._id, { $set: { products: [] } });
    res.status(200).json();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Could not delete the products in the cart`, error });
  }
});

//remover entire Order
router.delete("/delete-cart", async (req, res) => {
  const { id } = req.user;

  try {
    await CartProduct.deleteMany({ userId: id });

    await Cart.findOneAndDelete({ userId: id });
    res.status(200).json({ message: "Order succesfully deleted" });
  } catch (error) {
    res.status(500).json({ message: `Could not delete the order`, error });
  }
});

module.exports = router;

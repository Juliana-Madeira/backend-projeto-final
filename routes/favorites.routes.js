const { Router } = require("express");
const CartProduct = require("../models/CartProduct");
const Cart = require("../models/Cart");
const MyFavorites = require("../models/MyFavorites");
const User = require("../models/User");

const router = Router();

router.get("/", async (req, res) => {
  const { id } = req.user;
  try {
    const list = await MyFavorites.findOne({ userId: id }).populate("products");
    res.status(200).json(list);
  } catch (error) {
    res
      .status(500)
      .json({ message: `You don't have favorite products`, error });
  }
});

//add
router.post("/add/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  console.log(productId, userId);

  try {
    const list = await MyFavorites.findOne({ userId });
    console.log(list);

    const findProductId = list.products.includes(productId);
    console.log(findProductId);

    if (findProductId) {
      res.status(400).json({ message: "Product already added in your list" });
      return;
    }

    const updatedList = await MyFavorites.findOneAndUpdate(
      userId,
      { $push: { products: productId } },
      { new: true }
    );

    res.status(201).json(updatedList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//adicionar no order e deletar do favorites
router.post("/add-delete/:productId", async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;

  try {
    const cart = await Cart.findOne({ user_id: id });
    if (!cart) {
      const newCart = await Cart.create({ user_id: id });

      const payload = {
        productId,
        cartId: newCart._id,
        quantity: 1,
      };
      const product = await CartProduct.create(payload);
      const updatedCart = await Cart.findByIdAndUpdate(
        newCart._id,
        { $push: { products: product._id } },
        { new: true }
      );
      res.status(201).json(updatedCart);
    } else {
      const payload = {
        productId,
        cartId: cart._id,
        quantity: 1,
      };

      const productintheCart = await CartProduct.create(payload);
      const updateCart = await Cart.findByIdAndUpdate(
        cart._id,
        { $push: { products: productintheCart._id } },
        { new: true }
      );

      await MyFavorites.findOneAndUpdate(
        { userId: id },
        { $pull: { products: productId } },
        { new: true }
      );
      res.status(201).json(updateCart);
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error while moving product to cart, please try again!",
        error,
      });
  }
});

router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;

  try {
    await MyFavorites.findOneAndUpdate(
      { userId: id },
      { $pull: { products: productId } },
      { new: true }
    );
    res.status(200).json();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to delete product from favorites`, error });
  }
});

module.exports = router;
